import { Module } from '@nestjs/common';
import { FireormModule } from 'nestjs-fireorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { FirebaseAuthStrategy } from '../authentication/auth.strategy';
import * as findConfig from 'find-config';
import { CharacterModule } from '../characters/character.module';
import { ScheduleModule } from '@nestjs/schedule';
import * as admin from 'firebase-admin';
import { ExpansionModule } from '../expansion/expansion.module';
import { UserModule } from '../authentication/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    FireormModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const firebase_params = {
          type: process.env.FIRFIREBASE_ADMIN_TYPE,
          project_id: config.get('FIRESTORE_PROJECT_ID'),
          private_key_id: config.get('FIREBASE_PRIVATE_KEY_ID'),
          private_key: JSON.parse(config.get('FIREBASE_PRIVATE_KEY')),
          client_email: config.get('FIREBASE_CLIENT_EMAIL'),
          client_id: config.get('FIREBASE_CLIENT_ID'),
          auth_uri: config.get('FIREBASE_AUTH_URI'),
          token_uri: config.get('FIREBASE_TOKEN_URI'),
          auth_provider_x509_cert_url: config.get('FIREBASE_AUTH_PROVIDER_X509_CERT_URL'),
          client_x509_cert_url: config.get('FIREBASE_CLIENT_X509_CERT_URL')
        };
        const firebaseServiceAccount = {
          project_id: firebase_params.project_id,
          clientEmail: firebase_params.client_email,
          privateKey: firebase_params.private_key
        };
        const creds = admin.credential.cert(firebaseServiceAccount);
        const app = admin.initializeApp({
          credential: creds
        }, 'firestore');
        const firestore = admin.firestore(app);
        return {
          firestore: firestore
        }
      }
    }),
    ScheduleModule.forRoot(),
    CharacterModule,
    ExpansionModule,
    UserModule
  ],
  providers: [FirebaseAuthStrategy],
})
export class AppModule {}
