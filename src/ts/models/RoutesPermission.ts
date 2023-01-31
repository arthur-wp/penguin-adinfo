import { User } from './User';

export class RoutesPermission {
	private _method: string;
	private _route: string;

	constructor(route: string, method: string) {
		this._method = method;
		this._route = route;
	}

	public validatePermission(user: User): boolean {
		const adOpsTeamUserPostRoutes = ['/build/.*', '/csv', '/user/changepass', '/logout', '/login'];
		const adOpsTeamUserGetRoutes = [
			'/config',
			'/template',
			'/csv/list',
			'/csv',
			'/user',
			'/campaign/.*/list',
			'/campaign/.*/csv/list',
			'/adOpsTeams/campaigns',
		];
		const adOpsManagerGetRoutes = adOpsTeamUserGetRoutes.slice();
		const adOpsManagerPostRoutes = adOpsTeamUserPostRoutes.slice();

		adOpsManagerGetRoutes.push('/template/excel', '/users', '/adOpsTeam/users');
		adOpsManagerPostRoutes.push(
			'/register',
			'/user/.*/deactivate',
			'/user/.*/reactivate',
			'/campaign/.*/deactivate',
			'/campaign/.*/reactivate',
			'/campaign'
		);

		if (user.permission === 'user') {
			if (this._method === 'POST') {
				return adOpsTeamUserPostRoutes.filter((route) => new RegExp(route).test(this._route)).length > 0;
			} else if (this._method === 'GET') {
				return adOpsTeamUserGetRoutes.filter((route) => new RegExp(route).test(this._route)).length > 0;
			} else {
				return false;
			}
		} else if (user.permission === 'adOpsManager') {
			if (this._method === 'POST') {
				return adOpsManagerPostRoutes.filter((route) => new RegExp(route).test(this._route)).length > 0;
			} else if (this._method === 'GET') {
				return adOpsManagerGetRoutes.filter((route) => new RegExp(route).test(this._route)).length > 0;
			} else {
				return false;
			}
		} else if (user.permission === 'admin' || user.permission === 'owner') {
			return true;
		} else {
			return false;
		}
	}
}
