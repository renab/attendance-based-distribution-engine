import { Controller, Get, Put, UseGuards, Param, Body, Res, Response, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { UserService } from './auth.service';
import { FirebaseAuthGuard } from './auth.guard';
import { Claims } from './claims.decorator';
import { ClaimObject } from './model/claims.schema';

@Controller('/api/users')
export class UserController {
    private readonly logger = new Logger(UserController.name);
    constructor(private readonly userService: UserService) {}

    @Get('')
    @Claims('Admin')
    @UseGuards(FirebaseAuthGuard)
    async getAll() {
        return await this.userService.findAll();
    }

    @Get('/count')
    @Claims('Admin')
    @UseGuards(FirebaseAuthGuard)
    async getCount() {
        return (await this.userService.findAll()).length;
    }

    @Put(':id')
    @Claims('SuperAdmin')
    @UseGuards(FirebaseAuthGuard)
    async updateExpansion(@Param('id') id: string, @Body() claims: ClaimObject) {
        if (!id)
        {
            throw new HttpException('The ID of the user you wish to modify must be specified.', HttpStatus.NOT_ACCEPTABLE);            
        }
        return await this.userService.updateClaims(id, claims);
    }
}