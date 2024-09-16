// import { Message } from "../models/message.models"; 

export interface ApiResponse{
    sucess:boolean;
    message:string;
    messages?:Array<String>
}