import React from 'react'
import {
	Alert,
	Keyboard,
	RefreshControl,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View
} from 'react-native'

import { connect } from 'react-redux'
import {
	collapse,
	refreshing,
	updateStock,
	penjualan
} from '../../redux/actions'

import {
	Button,
	ButtonIcons,
	Touchable
} from '../../components'

import {
	makeId
} from '../../modules'


class SaleScreen extends React.Component {
	static navigationOptions = ({ navigation }) => ({
		headerLeft: (
			<ButtonIcons
				onPress = { () => { navigation.navigate('DrawerOpen') }}
				name = 'md-menu'
				color = 'white'
				size = { 30 }/>
		)
	})

	state = {
		keyboard: false,
		view: [],
		sale: {
			data: [],
			total: 0.00
		}
	}

	_scanQR() {
		this.props.navigation.navigate('ScanQR', { type: 'addCategory' })
	}

	_onRefresh() {
		this.props.dispatchRefreshing(true)
		setTimeout(() => {
			this.props.dispatchRefreshing(false)
		}, 3000)
	}

	_renderRefresh() {
		return (
			<RefreshControl
				refreshing = { this.props.refreshing }
				onRefresh = { this._onRefresh.bind(this) }
				colors = {[ 'red', 'green', 'blue' ]}
			/>
		)
	}

	_collapse(index) {
		const stateCopy = this.state

		stateCopy.view[index] = !stateCopy.view[index]

		this.setState(stateCopy)
	}

	_addSale(idCategory, product) {
		for(var i in this.props.category) {
			if(this.props.category[i].idCategory === idCategory) {
				for(var j in this.props.category[i].product) {
					if(this.props.category[i].product[j].idProduct === product.idProduct) {
						/*
						*
						cek quantity product
						*
						*/
						if(this.props.category[i].product[j].quantity > 0) {
							/*
							*
							ada stock
							*
							*/
							if(this.props.category[i].product[j].quantity <= 5) {
								/*
								*
								stock menipis
								*
								*/
								Alert.alert(null, 'stock product ' + this.props.category[i].product[j].name + ' tersisa ' + this.props.category[i].product[j].quantity)
							}

							/*
							*
							tambah ke pembelian
							*
							*/
							const stateCopy = this.state

							if(stateCopy.sale.data.length === 0) {
								/*
								*
								input pembelian baru
								*
								*/
								stateCopy.sale['idTransaction'] = makeId()
								var data = {
									idCategory: idCategory,
									idProduct: product.idProduct,
									name: product.name,
									price: product.price,
									cost: product.cost,
									quantity: 0,
									disc: 0,
									subTotal: 0
								}
								stateCopy.sale.total = data.subTotal
							} else {
								/*
								*
								tambah pembelian
								*
								*/
								for(var i in stateCopy.sale.data) {
									/*
									*
									tambah quantity pembelian
									*
									*/
									if(stateCopy.sale.data[i].idProduct === product.idProduct) {
										// stateCopy.sale.data[i].quantity = stateCopy.sale.data[i].quantity + 1
										// stateCopy.sale.data[i].subTotal = (product.price * stateCopy.sale.data[i].quantity) - (0 / 100)

										/*
										*
										sum total
										*
										*/
										// var total = 0
										// for(var j in stateCopy.sale.data) {
											// total += stateCopy.sale.data[j].subTotal
										// }
										// stateCopy.sale.total = total

										// return this.setState(stateCopy)

										return Alert.alert(null, product.name + ' sudah ada di pembelian')
									}
								}

								/*
								*
								tambah item pembelian
								*
								*/
								var data = {
									idCategory: idCategory,
									idProduct: product.idProduct,
									name: product.name,
									price: product.price,
									cost: product.cost,
									quantity: 0,
									disc: 0,
									subTotal: 0
								}
							}

							/*
							*
							sum total
							*
							*/
							var total = 0
							for(var i in stateCopy.sale.data) {
								total += stateCopy.sale.data[i].subTotal
							}

							stateCopy.sale.total = total + data.subTotal
							stateCopy.sale.data.push(data)

							this.setState(stateCopy)
						} else {
							/*
							*
							tidak ada stock
							*
							*/
							Alert.alert(null, 'stock product ' + this.props.category[i].product[j].name + ' kosong')
						}
					}
				}
			}
		}
	}

	// _removeSale(product) {
	// 	const stateCopy = this.state
	// 	var total = 0
	// 	for(var i in stateCopy.sale.data) {
	// 		if(stateCopy.sale.data[i].idProduct === product.idProduct) {
	// 			if(stateCopy.sale.data[i].quantity === 1) {
	// 				/*
	// 				*
	// 				hapus item pembelian
	// 				*
	// 				*/
	// 				stateCopy.sale.data.splice(i, 1)
	// 			} else {
	// 				/*
	// 				*
	// 				kurangi quantity pembelian
	// 				*
	// 				*/
	// 				stateCopy.sale.data[i].quantity = stateCopy.sale.data[i].quantity - 1
	// 				stateCopy.sale.data[i].subTotal = (product.price * stateCopy.sale.data[i].quantity) - (0 / 100)
	// 			}
	// 		}

	// 		if(stateCopy.sale.data.length === 0) {
	// 			total = 0
	// 		} else {
	// 			total += stateCopy.sale.data[i].subTotal
	// 		}
	// 	}
	// 	stateCopy.sale.total = total

	// 	this.setState(stateCopy)
	// }

	_editQuantity(idx, content, text) {
		const stateCopy = this.state

		for(var i in this.props.category) {
			if(this.props.category[i].idCategory === content.idCategory) {
				for(var j in this.props.category[i].product) {
					if(this.props.category[i].product[j].idProduct === content.idProduct) {
						/*
						*
						stock tidak cukup
						*
						*/
						if(Number(text) > this.props.category[i].product[j].quantity) {
							return Alert.alert(null, 'stock tidak cukup')
						}
						/**/

						stateCopy.sale.data[idx].quantity = Number(text)
					}
				}
			}
		}

		this.setState(stateCopy)
	}

	_editDisc(idx, content, text) {
		const stateCopy = this.state

		stateCopy.sale.data[idx].disc = Number(text)

		this.setState(stateCopy)
	}

	_updatePrice() {
		const stateCopy = this.state
		var total = 0

		for(var i in stateCopy.sale.data) {
			stateCopy.sale.data[i].subTotal = (stateCopy.sale.data[i].quantity * stateCopy.sale.data[i].price) - ((stateCopy.sale.data[i].quantity * stateCopy.sale.data[i].price) * (stateCopy.sale.data[i].disc / 100))

			total += stateCopy.sale.data[i].subTotal
		}
		stateCopy.sale.total = total

		this.setState(stateCopy)
	}

	_clear() {
		const stateCopy = this.state

		if(stateCopy.sale.data.length > 0) {
			Alert.alert(null, 'Anda yakin ingin menghapus pembelian ?',
				[
					{ text: 'yakin', onPress: () => this.setState({sale: { data: [], total: 0.00 }})},
					{ text: 'tidak' }
				])
		}
	}

	_done() {
		const stateCopy = this.state

		/*
		*
		belum ada list pembelian
		*
		*/
		if(stateCopy.sale.data.length === 0) {
			return Alert.alert(null, 'belum ada daftar pembelian')
		}
		/**/

		/*
		*
		total belanja 0
		*
		*/
		if(stateCopy.sale.total == 0) {
			return Alert.alert(null, 'pembelian anda tidak valid')
		}
		/**/

		Alert.alert(null, 'Anda yakin sudah selesai berbelanja ?',
			[
				{ text: 'yakin', onPress: () => {
					stateCopy.sale['date'] = new Date()
					this.props.dispatchUpdateStock(stateCopy.sale)
					this.props.dispatchPenjualan(stateCopy.sale)
					this.setState({sale: { data: [], total: 0.00 }})
				}},
				{ text: 'tidak' }
			])
	}

	render() {
		return(
			<View style = { styles.container }>
				<View style = {{ flex: 1 }}>
					{/*
					*
					scan barcode
					*
					*/}
					<View style = { styles.row }>
						<View style = {{ flex: 0.5 }}>
							<Button
								onPress = { this._scanQR.bind(this) }
								name = 'Scan' />
						</View>

						<View style = {{ flex: 2 }}>
							<TextInput />
						</View>
					</View>

					{/*
					*
					list pembelian
					*
					*/}
					<ScrollView
						keyboardShouldPersistTaps = 'always'
						style = {{ flex: 1 }}>
						{this.state.sale.data.map((content, index) => {
							return (
								<View
									key = { index }
									style = {{ flex: 1, flexDirection: 'column', borderWidth: 0.5, borderColor: 'transparent', backgroundColor: index%2 == 0 ? '#ccc' : 'white' }}>
									<View
										style = {{ flex: 1 }}>
										<View style = {{ flex: 1 }}>
											<Text> {content.name} </Text>
										</View>

										<View style = {{ flex: 1, flexDirection: 'row' }}>
											<View style = {{ flex: 0.5 }}>
												<TextInput
													ref = { (c) => this._quantity = c }
													keyboardType = 'numeric'
													returnKeyType = 'done'
													underlineColorAndroid = 'transparent'
													onChangeText = { (text) => this._editQuantity(index, content, text) }
													onEndEditing = { this._updatePrice.bind(this) }
													onSubmitEditing = { this._updatePrice.bind(this) }
													style = {{ flex: 1, padding: 0, color: 'gray', borderWidth: 0.5 }}
													value = { content.quantity.toString() }/>
											</View>

											<View style = {{ flex: 1, padding: 5, alignItems: 'flex-end' }}>
												<Text> {content.price} </Text>
											</View>

											<View style = {{ flex: 1, flexDirection: 'row' }}>
												<View style = {{ flex: 1 }}>
													<TextInput
														ref = { (c) => this._disc = c }
														keyboardType = 'numeric'
														returnKeyType = 'done'
														underlineColorAndroid = 'transparent'
														onChangeText = { (text) => this._editDisc(index, content, text) }
														onEndEditing = { this._updatePrice.bind(this) }
														onSubmitEditing = { this._updatePrice.bind(this) }
														style = {{ flex: 1, padding: 0, color: 'gray', borderWidth: 0.5 }}
														value = { content.disc.toString() }/>
												</View>
												
												<View style = {{ padding: 5 }}>
													<Text> % </Text>
												</View>
											</View>

											<View style = {{ flex: 1, padding: 5, alignItems: 'flex-end' }}>
												<Text> {content.subTotal} </Text>
											</View>
										</View>
									</View>
								</View>
							)
						})}
					</ScrollView>

					<View style = { styles.row }>
						<View style = {{ flex: 1 }}>
							<Text> Total </Text>
						</View>

						<View style = {{ flex: 2, alignItems: 'flex-end' }}>
							<Text> {this.state.sale.total} </Text>
						</View>
					</View>
				</View>

				{this.state.keyboard ?
					null
					:
					<View style = {{ flex: 1 }}>
						{/*
						*
						list inventory
						*
						*/}
						<ScrollView
							style = {{ flex: 1 }}
							refreshControl = { this._renderRefresh() }>
							{this.props.category.map((content, index) => {
								/*
								*
								list category
								*
								*/
								return (
									<View
										key = { index }
										style = {{ flex: 1 }}>
										<View style = { styles.category }>
											<Touchable
												style = {{ flex: 1 }}
												onPress = { this._collapse.bind(this, index) }>
												<View style = {{ flex: 1, flexDirection: 'row' }}>
													<Text> {index + 1}. </Text>
													
													<View style = {{ flexDirection: 'column' }}>
														<View style = {{ flex: 1 }}>
															<Text> {content.idCategory} </Text>
														</View>

														<View style = {{ flex: 1, flexDirection: 'row' }}>
															<Text> {content.name} </Text>
														</View>
													</View>
												</View>
											</Touchable>
										</View>

										{content.product.map((product, idx) => {
											/*
											*
											list product
											*
											*/
											return (
												<View
													key = { idx }>
													{this.state.view[index] ?
														<View
															style = {[ styles.category, { marginLeft: 10 }]}>
															<Touchable
																style = {{ flex: 1 }}
																onPress = { this._addSale.bind(this, content.idCategory, product) }>
																<View style = {{ flex: 1, flexDirection: 'row' }}>
																	<Text> {idx + 1}. </Text>

																	<View style = {{ flex: 1, flexDirection: 'column' }}>
																		<View style = {{ flex: 1 }}>
																			<Text> {product.barcode} </Text>
																		</View>

																		<View style = {{ flex: 1 }}>
																			<Text> {product.name} </Text>
																		</View>

																		<View style = {{ flex: 1, flexDirection: 'row' }}>
																			<View style = {{ flex: 1 }}>
																				<Text> qty: {product.quantity} </Text>
																			</View>

																			<View style = {{ flex: 1 }}>
																				<Text> price: {product.price} </Text>
																			</View>
																		</View>
																	</View>
																</View>
															</Touchable>
														</View>
														:
														null
													}
												</View>
											)
										})}
									</View>
								)
							})}
						</ScrollView>

						<View style = {{height: 45 }}/>

						<View style = { styles.stickyBottom }>
							<View style = { styles.row }>
								<Button
									onPress = { this._clear.bind(this) }
									name = 'Clear' />

								<Button
									onPress = { this._done.bind(this) }
									name = 'Done' />
							</View>
						</View>
					</View>
				}
			</View>
		)
	}

	_keyboardDidShow() {
		this.setState({
			keyboard: true
		})
	}

	_keyboardDidHide() {
		this.setState({
			keyboard: false
		})
	}

	componentWillMount() {
		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this))
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this))
	}

	componentWillUnmount() {
		this.keyboardDidShowListener.remove()
		this.keyboardDidHideListener.remove()
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 5,
		backgroundColor: 'white'
	},
	row: {
		flexDirection: 'row'
	},
	stickyBottom: {
		position: 'absolute',
		left: 5,
		right: 5,
		bottom: 0
	},
	category: {
		flex: 1,
		padding: 5,
		marginTop: 2.5,
		marginBottom: 2.5,
		borderRadius: 5,
		borderWidth: 0.5,
		borderColor: 'darkgrey',
		backgroundColor: '#ccc'
	}
})


function mapStateToProps (state) {
	return {
		category: state.category.data,
		refreshing: state.category.refreshing
	}
}

function mapDispatchToProps (dispatch) {
	return {
		dispatchCollapse: (data) => dispatch(collapse(data)),
		dispatchRefreshing: (data) => dispatch(refreshing(data)),
		dispatchUpdateStock: (data) => dispatch(updateStock(data)),
		dispatchPenjualan: (data) => dispatch(penjualan(data))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SaleScreen)