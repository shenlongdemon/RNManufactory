/**
 * Support IDE valid code
 */

interface INavigate {
  navigate(routeName: string): void;
}
export default interface INavigation {
  navigation: INavigate;
}
