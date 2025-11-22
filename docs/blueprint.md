# **App Name**: Parkinson's ICD Insights

## Core Features:

- Data Input and Preprocessing: Accepts patient data related to gambling, sexual, buying, eating, and other compulsive activities, then preprocesses it for model input.
- ICD Risk Prediction: Utilizes an ensemble predictive model to assess the risk of Impulse Control Disorders (ICD) in Parkinson's Disease patients based on provided data.
- SHAP Value Explanation: Generates SHAP (Shapley Additive exPlanations) values to provide insights into the factors driving each patient's ICD risk prediction. Acts as a tool for explaining the reasoning of the AI. This function requires tight coupling with the prior one.
- Risk Visualization: Presents ICD risk and contributing factors in an understandable visual format.
- Personalized Intervention Suggestions: Offers tailored intervention recommendations based on the patient's risk factors and SHAP analysis. Relies on the explanation function being informative and relevant.
- User-friendly Interface: Intuitive web interface for easy data input, result interpretation, and navigation.

## Style Guidelines:

- Primary color: Deep blue (#3F51B5) to convey trust and clinical expertise.
- Background color: Light gray (#F5F5F5) for a clean and professional look.
- Accent color: Soft orange (#FFAB40) to highlight key data points and interactive elements.
- Body font: 'Inter', a sans-serif, provides a modern, neutral and readable style.
- Headline font: 'Space Grotesk', a sans-serif, for a techy and modern feel that still remains readable.
- Use clear, professional icons to represent data inputs, risk levels, and intervention types.
- Employ a clean, organized layout with clear visual hierarchy to present information effectively.
- Subtle transitions and animations to enhance user experience and provide feedback on interactions.