import { Injectable } from '@nestjs/common';
import { ProducerService } from 'src/kafka/producer/producer.service';
import {Message} from "@webchat-backend/types";
import { KAFKA_EVENTS } from 'src/app.types';


@Injectable()
export class ChatProducer {

    constructor (private readonly producer:ProducerService){};

    async addMessage({message}:{message:any}){
        try{
            const payload={
                ...message,
                event:KAFKA_EVENTS.MESSAGE_CREATE
            }
            await this.producer.produce({
                topic:"chat-message",
                messages:[{
                    key:payload.id,
                    value:JSON.stringify(payload)}]
            })  
             return {status:202,message:"Message added to queue"}
        }
        catch(err){
            return {status:500,message:"Internal Server Error"}
        }
    }

     async deleteMessage({message}:{message:any}){
        try{
            const payload={
                ...message,
                event:KAFKA_EVENTS.MESSAGE_DELETE
            }
            await this.producer.produce({
                topic:"chat-message",
                messages:[{
                    key:payload.id,
                    value:JSON.stringify(payload)}]
            })  
             return {status:202,message:"Message added to queue"}
        }
        catch(err){
            return {status:500,message:"Internal Server Error"}
        }
    }

     async updateMessage({message}:{message:any}){
        try{
            const payload={
                ...message,
                event:KAFKA_EVENTS.MESSAGE_UPDATE
            }
            await this.producer.produce({
                topic:"chat-message",
                messages:[{
                    key:payload.id,
                    value:JSON.stringify(payload)}]
            })  
             return {status:202,message:"Message added to queue"}
        }
        catch(err){
            return {status:500,message:"Internal Server Error"}
        }
    }

}
