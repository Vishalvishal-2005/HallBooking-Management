
// ==================== src/services/roboflowService.js ====================
import axios from 'axios';

const ROBOFLOW_API_KEY = import.meta.env.VITE_ROBOFLOW_API_KEY;
const ROBOFLOW_MODEL = 'hall-classification/1'; // Update with your model

export const classifyHallImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await axios.post(
      `https://detect.roboflow.com/${ROBOFLOW_MODEL}?api_key=${ROBOFLOW_API_KEY}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Roboflow classification error:', error);
    throw error;
  }
};

export const extractImageTags = (roboflowResponse) => {
  // Extract tags from Roboflow response
  const predictions = roboflowResponse.predictions || [];
  return predictions.map(pred => ({
    label: pred.class,
    confidence: pred.confidence
  }));
};
