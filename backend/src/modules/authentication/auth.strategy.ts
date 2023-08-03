import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import { ConfigService } from '@nestjs/config';
import * as firebase from 'firebase-admin';
import { Logger } from '@nestjs/common';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(
  Strategy,
  'firebase-auth',
) {
  private defaultApp: firebase.app.App;
  private readonly logger = new Logger(FirebaseAuthStrategy.name);
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
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
    });
    if (configService.get('FIREBASE_DEFAULT_SUPER_USER_UID'))
    {
      this.logger.log('Default Super Admin Specified. Setting Appropriate Claims.');
      const auth = this.defaultApp.auth();
      auth.listUsers().then(async data => {
        for (const user of data.users) {
          if (user.uid === configService.get('FIREBASE_DEFAULT_SUPER_USER_UID')) {
            await auth.setCustomUserClaims(user.uid, { 'SuperAdmin': true, 'Admin': true });
            this.logger.log('Super User Claims set.')
          }
        }
      }).catch((err) => {
        this.logger.error(`Error while setting Super User claims: ${err}`);
      });
    }
  }
  async validate(token: string) {
    const firebaseUser: any = await this.defaultApp
      .auth()
      .verifyIdToken(token, true)
      .catch((err) => {
        console.log(err);
        throw new UnauthorizedException(err.message);
      });
    if (!firebaseUser) {
      throw new UnauthorizedException();
    }
    return firebaseUser;
  }
}