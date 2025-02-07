import { Controller, Get, Param, Query, Req, Res, Session } from 'danet/mod.ts';
import { Session as OakSession } from 'session/mod.ts';
import { OAuth2Service } from './service.ts';
import { Tag } from 'danet_swagger/decorators.ts';
import { Oauth2Provider } from '../class.ts';

@Tag('oauth2')
@Controller('oauth2')
export class OAuth2Controller {
  constructor(
    private oauth2Service: OAuth2Service,
  ) {
  }

  @Get('login/:provider')
  async login(
    @Session() session: OakSession,
    // deno-lint-ignore no-explicit-any
    @Res() response: any,
    @Param('provider') provider: string,
    // deno-lint-ignore no-explicit-any
    @Query() query: any,
  ) {
    const { uri, codeVerifier } = await this.oauth2Service
      .getAuthorizationUri(provider);
    session.flash('codeVerifier', codeVerifier);
    session.flash('provider', provider);
    session.flash('redirectUrl', query.redirecturl);
    response.redirect(uri);
  }

  @Get('callback')
  async callback(
    @Session() session: OakSession,
    @Req() request: Request,
    // deno-lint-ignore no-explicit-any
    @Res() response: any,
  ) {
    // Make sure the codeVerifier is present for the user's session
    const codeVerifier = session.get('codeVerifier');
    const redirectUrl = session.get('redirectUrl');
    const provider: Oauth2Provider = session.get('provider') as Oauth2Provider;
    if (typeof codeVerifier !== 'string') {
      throw new Error('invalid codeVerifier');
    }
    const token = await this.oauth2Service.registerOrLoginUser(
      request.url,
      codeVerifier,
      provider,
    );
    if (!redirectUrl) {
      return token;
    }
    response.redirect(redirectUrl + '?token=' + token);
  }
}
