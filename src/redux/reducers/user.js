'use strict'

import {
	Alert,
	AsyncStorage
} from 'react-native'

import {
	makeId
} from '../../modules'

/*
*
user
*
*/
/*
{
	data: {
		token: string,
		idUser: string,
		email: string,
		name: string,
		password: string,
		level: string,
		lastLogin: date
	},
	navigation: function,
	process: bolean
}
*/

const initialState = {
	users: [],
	cabang: [],
	data: [],
	navigation: null,
	process: false
}

const UserReducers = (state = initialState, action) => {
	switch(action.type) {
		case 'LOCAL_STORAGE_USERS':
			if(action.data.users == undefined) {
				return {
					...state,
					cabang: action.data.cabang
				}
			} else {
				return {
					...state,
					users: action.data.users
				}
			}

		/*
		*
		register
		*
		*/
		/*
		action.data: {
			data: {
				name: string,
				email: string,
				phone: string,
				password: string
			},
			navigation: function
		}
		*/
		case 'REGISTER_USER':
			for(var i in state.users) {
				if(state.users[i].email.toUpperCase() == action.data.data.email.toUpperCase()) {
					// user sudah terdaftar
					Alert.alert(null, 'user ' + action.data.data.email + ' sudah terdaftar')
					return state
				}
			}
			const cabang = {
				idCabang: makeId(),
				name: 'Pusat',
				ket: null
			}
			const register = {
				idUser: makeId(),
				idCabang: cabang.idCabang,
				name: action.data.data.name,
				email: action.data.data.email,
				phone: action.data.data.phone,
				password: action.data.data.password,
			}
			AsyncStorage.multiSet([
				['@Users', JSON.stringify([...state.users, register])],
				['@Cabang', JSON.stringify([...state.cabang, cabang])]
			], (err) => console.log(err))
			Alert.alert(null, 'Pendaftaran berhasil, silahkan masuk', [{ text: 'OK', onPress: () => action.data.navigation.goBack() }])
			return {
				...state,
				cabang: [...state.cabang, cabang],
				users: [...state.users, register]
			}

		case 'LOGIN_PROCESS':
			return {
				...state,
				process: action.data
			}

		/*
		*
		login
		*
		*/
		/*
		action.data = {
			navigation: function,
			data: {
				email: string,
				password: string
			}
		}
		*/
		case 'LOGIN':
			if(state.users == null || state.users.length == 0) {
				Alert.alert(null, 'User atau password salah')
			} else {
				for(var i in state.users) {
					if(state.users[i].email.toUpperCase() == action.data.data.email.toUpperCase()) {
						if(state.users[i].password === action.data.data.password) {
							// user dan password benar
							state.users[i]['lastLogin'] = new Date()
							action.data.navigation.dispatch({
							  type: 'Navigation/RESET',
							  index: 0,
							  actions: [{ type: 'Navigation/NAVIGATE', routeName: 'HomeManager' }]
							})
							AsyncStorage.setItem('@User', JSON.stringify(state.users[i]))
							return {
								...state,
								process: false,
								data: state.users[i]
							}
						} else {
							// password salah
							Alert.alert(null, 'User atau password salah')
						}
					} else {
						// user tidak ada
						Alert.alert(null, 'User atau password salah')
					}
				}
			}

			/*const user = null
			if(action.data.data.email == 'manager' && action.data.data.password == 'manager') {
				action.data.navigation.dispatch({
				  type: 'Navigation/RESET',
				  index: 0,
				  actions: [{ type: 'Navigation/NAVIGATE', routeName: 'HomeManager' }]
				})

				user = {
					token: 'token',
					idUser: 'idManager',
					email: action.data.data.email,
					name: 'Manager',
					password: action.data.data.password,
					level: 'manager',
					lastLogin: new Date()
				}
			} else if(action.data.data.email == 'admin' && action.data.data.password == 'admin') {
				action.data.navigation.dispatch({
				  type: 'Navigation/RESET',
				  index: 0,
				  actions: [{ type: 'Navigation/NAVIGATE', routeName: 'HomeAdmin' }]
				})

				user = {
					token: 'token',
					idUser: 'idAdmin',
					email: action.data.data.email,
					name: 'Admin',
					password: action.data.data.password,
					level: 'admin',
					lastLogin: new Date()
				}
			} else {
				action.data.navigation.dispatch({
				  type: 'Navigation/RESET',
				  index: 0,
				  actions: [{ type: 'Navigation/NAVIGATE', routeName: 'Home' }]
				})

				user = {
					token: 'token',
					idUser: 'idUser',
					email: action.data.data.email,
					name: 'User',
					password: action.data.data.password,
					level: 'user',
					lastLogin: new Date()
				}
			}*/
			// AsyncStorage.setItem('@User', JSON.stringify(user))
			return {
				...state,
				process: false,
				// data: user
			}

		case 'LOGOUT':
			AsyncStorage.removeItem('@User')
			action.data.dispatch({
				key: null,
				type: 'Navigation/RESET',
				index: 0,
				actions: [{ type: 'Navigation/NAVIGATE', routeName: 'Login' }]
			})
			return {
				...state,
				data: null
			}

		case 'SET_USER':
			return {
				...state,
				data: action.data
			}

		default:
			return state
	}
}

module.exports = UserReducers