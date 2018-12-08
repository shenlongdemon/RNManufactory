import * as React from 'react';
import { PUBLIC_TYPES, IAuthService, FactoryInjection } from 'business_core_app_react';
import BasesSreen from './basescreen';
import { ROUTE } from './routes';

interface Props {}

interface State {}

export default class Loading extends BasesSreen<Props, State> {
  private authService: IAuthService = FactoryInjection.get<IAuthService>(PUBLIC_TYPES.IAuthService);

  constructor(props) {
    super(props);
    this.componentDidFocus = this.componentDidFocus.bind(this);
  }

  componentDidMount = async (): Promise<void> => {};

  private async componentDidFocus(): Promise<void> {
    await new Promise((r) => setTimeout(r, 1000));
    const isMasterLogged = await this.authService.isLoggedIn();
    if (!isMasterLogged) {
      this.navigate(ROUTE.LOGIN);
    } else {
      this.navigate(ROUTE.SWITCHFEATURE.DEFAULT);
    }
  }

  render() {
    return <BasesSreen {...{ ...this.props, componentDidFocus: this.componentDidFocus }} />;
  }
}
