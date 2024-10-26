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
import base64

app = Flask(__name__)
CORS(app, resources={r"/enhance": {"origins": "*"}}, supports_credentials=True)

UPLOAD_FOLDER = 'test_data/test'
RESULT_FOLDER = 'result'


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
    

@app.route('/enhance', methods=['POST'])
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
        
        # Save the image
    image.save(input_path)


    original_aspect_ratio = preprocess_image(input_path, input_path)

    # command = [
    #     "python", "main.py", 
    #     "--mode", "test_only", 
    #     "--LR_path", UPLOAD_FOLDER, 
    #     "--generator_path", "./model/pre_trained_model_200.pt"
    # ]
    
    

    # subprocess.run(command, check=True)
    
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

    # Convert the final image to data URL
    data_url = image_to_data_url(final_image)


    return jsonify({
            "success": True,
            "processedImage": data_url
        })

if __name__ == '__main__':
    app.run(debug=True,port=3000,host="0.0.0.0")