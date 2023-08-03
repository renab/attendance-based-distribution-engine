import { Logger, Injectable } from '@nestjs/common';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { ConfigService } from '@nestjs/config';
import { ClaimObject } from './model/claims.schema';
import * as firebase from 'firebase-admin'

@Injectable()
export class UserService {
    private readonly logger: Logger = new Logger(UserService.name);
    private defaultApp: firebase.app.App;
    constructor(configService: ConfigService) {
        const firebase_params = {
          type: process.env.FIRFIREBASE_ADMIN_TYPE,
          project_id: configService.get('FIRESTORE_PROJECT_ID'),
          private_key_id: configService.get('FIREBASE_PRIVATE_KEY_ID'),
          private_key: configService.get('FIREBASE_PRIVATE_KEY'),
          client_email: configService.get('FIREBASE_CLIENT_EMAIL'),
          client_id: configService.get('FIREBASE_CLIENT_ID'),
          auth_uri: configService.get('FIREBASE_AUTH_URI'),
          token_uri: configService.get('FIREBASE_TOKEN_URI'),
          auth_provider_x509_cert_url: configService.get('FIREBASE_AUTH_PROVIDER_X509_CERT_URL'),
          client_x509_cert_url: configService.get('FIREBASE_CLIENT_X509_CERT_URL')
        };
        const firebaseServiceAccount = {
          project_id: firebase_params.project_id,
          clientEmail: firebase_params.client_email,
          privateKey: firebase_params.private_key
        };
        this.defaultApp = firebase.initializeApp({
          credential: firebase.credential.cert(firebaseServiceAccount),
        }, 'userManagement');
      }

    async findOne(id: string): Promise<UserRecord> {
        try {
            return await this.defaultApp.auth().getUser(id);
        } catch (err) {
            this.logger.error(err);
            return null;
        }
    }

    async findAll(): Promise<Array<UserRecord>> {
        try {
            const result = await this.defaultApp.auth().listUsers();
            if (result.users) return result.users;
            return [];
        } catch (err) {
            this.logger.error(err);
            return [];
        }
    }

    async updateClaims(id: string, claims: ClaimObject): Promise<UserRecord> {
        try {
            await this.defaultApp.auth().setCustomUserClaims(id, claims);
            const updatedRecord = await this.defaultApp.auth().getUser(id);
            return updatedRecord;
        } catch (err) {
            this.logger.error(err);
            return null;
        }
    }
}