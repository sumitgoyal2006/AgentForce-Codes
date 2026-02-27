public with sharing class QnApexClassService {

    @AuraEnabled(cacheable=false)
    public static String invokeFileQAITemplate(String userQuestion, Id fileId) {

    // Wrap the user question string in a WrappedValue object for the prompt template input
    ConnectApi.WrappedValue userQuestionInstance = new ConnectApi.WrappedValue();
    userQuestionInstance.value = userQuestion;

    // Create a map to hold the file ID (required format for object inputs)
   //ConnectApi.RecordReference  fileRef = new ConnectApi.RecordReference();
    //fileRef.id = fileId;
    Map<String,String> recordMap=new Map<String,String>();
    recordMap.put('id',fileId); 

     ConnectApi.WrappedValue fileInstance = new ConnectApi.WrappedValue();
     fileInstance.value = recordMap;


    // Create the input parameters map that will be passed to the prompt template
    // The key format: input:parameterName must match the API names defined in the template
    Map<String, ConnectApi.WrappedValue> inputParamsMap =new Map<String, ConnectApi.WrappedValue>();

    inputParamsMap.put('Input:userQuestion', userQuestionInstance);
    inputParamsMap.put('Input:File', fileInstance);

        System.debug(inputParamsMap);
    // Create the input object for the prompt template generation
    ConnectApi.EinsteinPromptTemplateGenerationsInput executeTemplateInput =new ConnectApi.EinsteinPromptTemplateGenerationsInput();

    // Configure additional settings for the LLM generation
    executeTemplateInput.additionalConfig = new ConnectApi.EinsteinLlmAdditionalConfigInput();
    executeTemplateInput.additionalConfig.applicationName = 'PromptBuilderPreview';

    // Set preview to false to generate actual responses (true would only resolve the prompt)
    executeTemplateInput.isPreview = false;

    // Pass the input parameters to the template input object
    executeTemplateInput.inputParams = inputParamsMap;

	System.debug(executeTemplateInput);
            try {
            // Call the service
             ConnectApi.EinsteinPromptTemplateGenerationsRepresentation generationsOutput =
                           ConnectApi.EinsteinLLM.generateMessagesForPromptTemplate(
                'QnATemplate',
                executeTemplateInput
            );
             System.debug('Generations Output: ' + generationsOutput);
            ConnectApi.EinsteinLLMGenerationItemOutput response = generationsOutput.generations[0];               
            System.debug('Generations Size: ' + generationsOutput.generations.size());
            return response.text;
        } 
        catch (Exception e) {
            System.debug('Failed to generate message: ' + e.getMessage());            
            throw e;
        }




}
   
}