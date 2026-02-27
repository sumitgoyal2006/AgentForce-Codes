import { LightningElement } from 'lwc';
import invokeFileQAITemplate from '@salesforce/apex/QnApexClassService.invokeFileQAITemplate';
export default class Lwc1 extends LightningElement {
    accptedFormats=['.txt', '.pdf', '.png', '.jpg', '.jpeg'];
    fileUploaded=false;
    errorMessage='';
    contentDocumentId;
    askQuestions;
    answer;

    questionHandler(event)
    {
        this.askQuestions=event.target.value;
       
    }

    getAnswer(event)
    {   
        if(!this.contentDocumentId)
        {
            this.errorMessage = 'Please upload a file first';
            this.fileUploaded = false;
            return;
        }
        this.answer=''
        this.errorMessage='';
        invokeFileQAITemplate(
            {
                userQuestion:this.askQuestions.trim(),
                fileId:this.contentDocumentId
            }
        )
        .then(result=>{
            const container = this.template.querySelector('.response-container');
              if (container) {
            container.innerHTML = result;
            }
           
        })
        .catch(error=>{
            this.errorMessage='An Error Occured';
            console.log('Error Calling Prompt Template');
        });

    }
    handleUploadFinished(event)
    {
        const uploadedFiles = event.detail.files;
        if(uploadedFiles.length > 0)
        {
           const uploadResult = uploadedFiles[0];
           if(uploadResult.documentId)
           {
            this.contentDocumentId = uploadResult.documentId;
            this.fileUploaded = true;
            this.errorMessage='';
            console.log('File Uploaded Successfully');
            console.log('File Id: '+this.contentDocumentId+'');
           }
           else{
            this.errorMessage = 'File upload failed';
            this.fileUploaded = false;

           }
        }
      

    }

}