import { Injectable } from '@nestjs/common';
import { UserDTO } from 'src/dto/user.dto';
import { Prisma, PrismaClient } from 'generated/prisma';
import { MetadataScanner } from '@nestjs/core';

const prisma = new PrismaClient();
@Injectable()
export class UserService {

  async getUserInfo(id: number, showEmail?: string) {
    console.log("this is  the user id recieved ", id);
    let user = await prisma.users.findUnique({
      where: {
        id: id
      }
    });
    console.log("show Email", showEmail);
    if (showEmail === 'show') {
      return { name: user?.name, email: user?.email };
    } else {
      return { name: user?.name };
    }

  }

  async createUser(userDTO: UserDTO) {
    try {

      const user = await prisma.users.create({
        data: {
          name: userDTO.name,
          email: userDTO.email,
        },
      });
      return { message: 'User created!', user };

    } catch (error) {
      // Handle unique constraint violation
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'

      ) {
        return {
          message: 'Email already exists!',
          status: 'fail',
        };
      }

      // Handle unexpected errors
      throw error;
    }
  }


  //to update existing user details
  async updateUser(userDTO: UserDTO, id: number) {
    //check wheather user exists or not
    let userCheck = await prisma.users.findFirst({
      where: {
        id: id
      },
      select: {
        id: true
      }
    });
    if (!userCheck || userCheck?.id <= 0) {
      return { status: "Fail", message: "User Doesnt exists" };
    }
    //check wheather email already exists or not
    let emailCheck = await prisma.users.findFirst({
      where: {
        email: userDTO.email
      },
      select: {
        id: true
      }
    });
    console.log(emailCheck)
    if (!emailCheck) {
      return { status: "Fail", message: "Email already exists" };
    }




    let updateStatus = await prisma.users.update({
      where: {
        id: userCheck?.id
      },
      data: {
        name: userDTO.name,
        email: userDTO.email
      }
    });

    return {
      status: "Success",
      message: "User Updated successfully",
      synopsis: updateStatus,
      userData: userDTO
    }
  }
  async getAllUsers() {
    let users = await prisma.users.findMany({
      select: {
        id: true,
        name: true,
        email: true
      }
    });
 let sta = "success";
    return { status: sta, data: users };

  }
}
