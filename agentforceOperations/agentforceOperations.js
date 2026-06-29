import { LightningElement,api } from 'lwc';
import {open,close, execute} from 'lightning/accApi';

export default class AgentforceOperations extends LightningElement {


    botId='0Xxg50000004yC5CAI';
    @api prompt='';

     handlePromptChange(event) {
        this.prompt = event.target.value;
    }

       async handleOpen() {
        try {
            await open(this.botId);
            console.log('Agentforce Panel Opened');
        } catch (error) {
            console.error(error);
        }
    }

      async handleClose() {
        try {
            await close();
            console.log('Agentforce Panel Closed');
        } catch (error) {
            console.error(error);
        }
    }

     async handleExecute() {
        try {

            // Open panel first
            await open(this.botId);

            // Send utterance
            await execute(
                this.prompt,
                this.botId
            );

            console.log('Prompt Sent');

        } catch (error) {
            console.error(error);
        }
    }


}