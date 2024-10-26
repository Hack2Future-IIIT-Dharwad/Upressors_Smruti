from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from PIL import Image
import os
import subprocess
import uuid
import torch
from torch.utils.data import DataLoader
from srgan_model import Generator
from dataset import *
from io import BytesIO
import cv2
import numpy as np
from tqdm import tqdm
import base64
import requests
from pathlib import Path
from deoldify.visualize import get_image_colorizer

app = Flask(__name__)
CORS(app, resources={r"/enhance/image": {"origins": "*"}}, supports_credentials=True)
CORS(app, resources={r"/enhance/video": {"origins": "*"}}, supports_credentials=True)
CORS(app, resources={r"/enhance/text": {"origins": "*"}}, supports_credentials=True)
CORS(app, resources={r"/colorize/image": {"origins": "*"}}, supports_credentials=True)

UPLOAD_FOLDER = 'test_data/test'
RESULT_FOLDER = 'result'
FRAMES_FOLDER = 'frames'
ENHANCED_FRAMES_FOLDER = 'enhanced_frames'

# Create necessary directories
for folder in [UPLOAD_FOLDER, RESULT_FOLDER, FRAMES_FOLDER, ENHANCED_FRAMES_FOLDER]:
    os.makedirs(folder, exist_ok=True)

def extract_frames(video_path):
    """Extract frames from video and save them"""
    video = cv2.VideoCapture(video_path)
    fps = video.get(cv2.CAP_PROP_FPS)
    frame_count = int(video.get(cv2.CAP_PROP_FRAME_COUNT))
    
    frames = []
    success = True
    count = 0
    
    while success:
        success, frame = video.read()
        if success:
            frame_path = os.path.join(FRAMES_FOLDER, f"frame_{count:04d}.png")
            cv2.imwrite(frame_path, frame)
            frames.append(frame_path)
            count += 1
    
    video.release()
    return frames, fps

def video_to_data_url(file_path):
    try:
        # Read the video file in binary mode
        with open(file_path, 'rb') as video_file:
            # Encode the binary data to base64
            video_data = base64.b64encode(video_file.read()).decode('utf-8')
            # Create the data URL
            return f"data:video/mp4;base64,{video_data}"
    except Exception as e:
        raise Exception(f"Error converting video to data URL: {str(e)}")

def process_frame(frame_path, generator, device):
    """Process a single frame using the SRGAN model"""
    # Preprocess frame
    image = Image.open(frame_path)
    image_resized = image.resize((256, 256), Image.Resampling.LANCZOS).convert("RGB")
    
    # Convert to tensor and normalize
    image_np = np.array(image_resized)
    image_tensor = torch.from_numpy(image_np.transpose(2, 0, 1)).float()
    image_tensor = (image_tensor / 127.5) - 1.0
    image_tensor = image_tensor.unsqueeze(0).to(device)
    
    # Generate high-res frame
    with torch.no_grad():
        output, _ = generator(image_tensor)
        output = output[0].cpu().numpy()
        output = (output + 1.0) / 2.0
        output = output.transpose(1, 2, 0)
        enhanced_frame = Image.fromarray((output * 255.0).astype(np.uint8))
    
    # Resize back to original aspect ratio
    original_size = Image.open(frame_path).size
    enhanced_frame = enhanced_frame.resize((original_size[0] * 4, original_size[1] * 4), Image.Resampling.LANCZOS)
    
    return enhanced_frame

def create_video(enhanced_frames, output_path, fps):
    """Create video from enhanced frames"""
    first_frame = cv2.imread(enhanced_frames[0])
    height, width = first_frame.shape[:2]
    
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
    
    for frame_path in enhanced_frames:
        frame = cv2.imread(frame_path)
        out.write(frame)
    
    out.release()

def clean_up_frames():
    """Clean up temporary frame files"""
    for folder in [FRAMES_FOLDER, ENHANCED_FRAMES_FOLDER]:
        for file in os.listdir(folder):
            os.remove(os.path.join(folder, file))


os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULT_FOLDER, exist_ok=True)

def preprocess_image(image_path, save_path):
    image = Image.open(image_path)

    image_resized = image.resize((256, 256), Image.Resampling.LANCZOS).convert("RGB")
    image_resized.save(save_path)
    return image.width / image.height

def image_to_data_url(image):
    # Convert PIL Image to data URL
    buffered = BytesIO()
    image.save(buffered, format="PNG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    return f"data:image/png;base64,{img_str}"

def postprocess_output(output_path, original_aspect_ratio, save_path):
    output_image = Image.open(output_path)

    if original_aspect_ratio > 1:
        new_width = 1024
        new_height = int(new_width / original_aspect_ratio)
    else:
        new_height = 1024
        new_width = int(new_height * original_aspect_ratio)

    final_image = output_image.resize((new_width, new_height), Image.Resampling.LANCZOS)
    # final_image.save(save_path)
    return final_image
    

@app.route('/enhance/image', methods=['POST'])
def enhance_image():
    
    
    image_data_url = request.json.get('image')
        
    if not image_data_url:
            return jsonify({"error": "No image provided"}), 400
        
        # Extract the base64 encoded image data
    header, encoded = image_data_url.split(',', 1)
        
        # Decode the base64 string to bytes
    image_data = base64.b64decode(encoded)
        
        # Create a blob-like object using BytesIO
    blob = BytesIO(image_data)
        
        # Create image object from blob
    image = Image.open(blob)
        
        # Generate unique filename
    filename = 'input.png'
    input_path = os.path.join(UPLOAD_FOLDER, filename)

    image.save(input_path)


    original_aspect_ratio = preprocess_image(input_path, input_path)

    
    output_file_name=""
    def test_only():
    
        device = torch.device("cpu")
        dataset = testOnly_data(LR_path = 'test_data/test' , in_memory = False, transform = None)
        loader = DataLoader(dataset, batch_size = 1, shuffle = False, num_workers = 0)
        
        generator = Generator(img_feat = 3, n_feats = 64, kernel_size = 3, num_block = 16)
        generator.load_state_dict(torch.load("./model/pre_trained_model_200.pt", map_location = device))
        generator = generator.to(device)
        generator.eval()
        
        with torch.no_grad():
            for i, te_data in enumerate(loader):
                lr = te_data['LR'].to(device)
                output, _ = generator(lr)
                output = output[0].cpu().numpy()
                output = (output + 1.0) / 2.0
                output = output.transpose(1,2,0)
                result = Image.fromarray((output * 255.0).astype(np.uint8))
                result.save('./result/output.png')
            
                
                
                
    test_only()

    output_path = './result/output.png'
    print(output_path)
    if not os.path.exists(output_path):
        return jsonify({"error": "Enhanced image not found"}), 500

    final_output_path = os.path.join(RESULT_FOLDER, f"final_{filename}")
    final_image = postprocess_output(output_path, original_aspect_ratio, final_output_path)

  
    data_url = image_to_data_url(final_image)


    return jsonify({
            "success": True,
            "processedImage": data_url
        })
    
    
@app.route('/enhance/video', methods=['POST'])
def enhance_video():
    try:
        video_data_url = request.json.get('video')
    
        if not video_data_url:
            return jsonify({"error": "No video provided"}), 400

        # Extract the base64 encoded video data
        header, encoded = video_data_url.split(',', 1)
        
        # Decode the base64 string to bytes
        video_data = base64.b64decode(encoded)

        # Create a BytesIO object from the decoded bytes
        video_stream = BytesIO(video_data)

        # Read the BytesIO stream into a numpy array
        video_bytes = np.frombuffer(video_stream.read(), np.uint8)

        # Convert the numpy array to a video file format using OpenCV
        video_path = os.path.join(UPLOAD_FOLDER, "input_video.mp4")

        # Write the video data to the file
        with open(video_path, "wb") as f:
            f.write(video_bytes)
        
        # Extract frames
        print("Extracting frames...")
        frames, fps = extract_frames(video_path)
        
        # Initialize model
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        generator = Generator(img_feat=3, n_feats=64, kernel_size=3, num_block=16)
        generator.load_state_dict(torch.load("./model/pre_trained_model_200.pt", map_location=device))
        generator = generator.to(device)
        generator.eval()
        
        # Process frames
        print("Enhancing frames...")
        enhanced_frames = []
        for i, frame_path in enumerate(tqdm(frames)):
            enhanced_frame = process_frame(frame_path, generator, device)
            enhanced_frame_path = os.path.join(ENHANCED_FRAMES_FOLDER, f"enhanced_frame_{i:04d}.png")
            enhanced_frame.save(enhanced_frame_path)
            enhanced_frames.append(enhanced_frame_path)
        
        # Create output video
        print("Creating output video...")
        output_path = os.path.join(RESULT_FOLDER, "enhanced_video.mp4")
        create_video(enhanced_frames, output_path, fps)
        
        try:
            video_data_url = video_to_data_url(output_path)
            clean_up_frames()
            return jsonify({
                "success": True,
                "processedVideo": video_data_url
            })
        except Exception as e:
            return jsonify({"error": str(e)}), 500
            
    except Exception as e:
        clean_up_frames()  # Clean up on error
        return jsonify({"error": str(e)}), 500
    
    

    
@app.route('/enhance/text', methods=['POST'])
def enhance_video_from_text():
    
        
                
        def send_generation_request(host, params):
            STABILITY_KEY ="sk-SsZNGnGEiuM8RB2NI1wfpu6cpHgq4UELFeVbv1bHbZ1E7EN9"
            if not STABILITY_KEY:
                raise ValueError("STABILITY_KEY environment variable is not set.")
            headers = {
                "Accept": "image/*",
                "Authorization": f"Bearer {STABILITY_KEY}",
                
            }
            files = {}
            image = params.pop("image", None)
            mask = params.pop("mask", None)
            if image is not None and image != '':
                files["image"] = open(image, 'rb')
            if mask is not None and mask != '':
                files["mask"] = open(mask, 'rb')
            if len(files)==0:
                files["none"] = ''

            response = requests.post(
                host,
                headers=headers,
                files=files,
                data=params
            )

            if not response.ok:
                raise Exception(f"HTTP {response.status_code}: {response.text}")

            return response

        try:
            data = request.json
            prompt = data.get('text')
            negative_prompt = data.get('negative_prompt', '')
            aspect_ratio = data.get('aspect_ratio', '3:2')
            seed = data.get('seed', 0)
            output_format = data.get('output_format', 'jpeg')

            host = "https://api.stability.ai/v2beta/stable-image/generate/ultra"
            params = {
                "prompt": prompt,
                "negative_prompt": negative_prompt,
                "aspect_ratio": aspect_ratio,
                "seed": seed,
                "output_format": output_format
            }
   
            response = send_generation_request(host, params)
            output_image=response.content
    

            if isinstance(output_image, bytes):
            # Convert bytes to a PIL Image
                output_image = Image.open(BytesIO(output_image))

            data_url = image_to_data_url(output_image)
      
            
            
            return jsonify({
                "success": True,
                "processedImage": data_url
            })
            
           
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        
        
        
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
_colorizer = get_image_colorizer(root_folder=Path("."), artistic=True)
        
@app.route('/colorize/image', methods=['POST'])
def colorize():
    
    try:
        
        image_data_url = request.json.get('image')
        
        if not image_data_url:
                return jsonify({"error": "No image provided"}), 400
            
            # Extract the base64 encoded image data
        header, encoded = image_data_url.split(',', 1)
            
            # Decode the base64 string to bytes
        image_data = base64.b64decode(encoded)
            
            # Create a blob-like object using BytesIO
        blob = BytesIO(image_data)
            
            # Create image object from blob
        image = Image.open(blob)
  
        filename = 'input.png'
        input_path = os.path.join("uploads", filename)
            
            # Save the image
        image.save(input_path)

        # Colorize the image
        render_factor = int(request.form.get('render_factor', 10))  # Get render factor from the form, default is 10
        output_image = _colorizer.get_transformed_image(
            path=input_path,
            render_factor=render_factor,
            watermarked=False,
            post_process=True
        )

        # # Save the result to a BytesIO object
        # output_buffer = io.BytesIO()
        # output_image.save(output_buffer, format="JPEG")
        # output_buffer.seek(0)

        if isinstance(output_image, bytes):
                # Convert bytes to a PIL Image
                    output_image = Image.open(BytesIO(output_image))

        data_url = image_to_data_url(output_image)
        
            
            
        return jsonify({
                    "success": True,
                    "processedImage": data_url
                })
        
                
    except Exception as e:
            return jsonify({"error": str(e)}), 500
        
if __name__ == '__main__':
    app.run(debug=True,port=3000,host="0.0.0.0")