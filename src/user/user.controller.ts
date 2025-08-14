import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from 'src/dto/user.dto';
import { GrpcMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs/internal/Observable';
@Controller()
export class UserController {
   constructor(private readonly userService: UserService) { }
   // @Get(":id")
   @GrpcMethod('UserService', 'getuserInfo')
   getuserInfo(data: { id: string, showEmail: string }) {
      let userId = parseInt(data.id);

      return this.userService.getUserInfo(userId, data.showEmail);
   }
   @GrpcMethod('UserService', 'getAllUsers')
   getAllUsers() {
      return this.userService.getAllUsers();
   }

   // @Post()
   @GrpcMethod('UserService', 'createUser')
   createUser(data: UserDTO) {
      return this.userService.createUser(data);
   }
   // @Post("update")
   @GrpcMethod('UserService', 'updateUser')
   updateUser(data: UserDTO & { id: string }) {
      let userId = parseInt(data.id);
      return this.userService.updateUser(data, userId)
   }

   //get all users via stream
   @GrpcMethod('UserService', 'getUsersViaStream')
   async getUsersViaStream() {
      let users = await this.userService.getUsersViaStream();

      return new Observable<UserDTO>((subscriber) => {
         users.forEach((user, index) => {
            setTimeout(() => subscriber.next(user), index * 500);
         });
         setTimeout(() => subscriber.complete(), users.length * 500);
      });
   }

}
