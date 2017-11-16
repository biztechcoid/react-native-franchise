import React from 'react'
import {
	DrawerNavigator,
	StackNavigator,
	TabNavigator
} from 'react-navigation'

import TabInventoryScreen from '../pages/inventory'
import TabSaleScreen from '../pages/sale'
import TabReportScreen from '../pages/report'
import SideMenu from '../pages/sidemenu'


const TabNavigatorConfig = {
	tabBarPosition: 'top',
	swipeEnabled: false,
	animationEnabled: true,
	lazy: false,
	tabBarOptions: {
		showIcon: false,
		showLabel: true,
		activeTintColor: '#6ecbe0',
		inactiveTintColor: 'black',
		iconStyle: {
			// margin: 0
		},
		labelStyle: {
			marginLeft: 0,
			marginRight: 0
		},
		tabSyle: {
			// backgroundColor: '#6ecbe0'
		},
		indicatorStyle: {
			backgroundColor: '#6ecbe0'
		},
		style: {
			backgroundColor: 'white'
		}
	}
}


const HomeScreen = TabNavigator({
	Persediaan: { screen: TabInventoryScreen },
	Penjualan: { screen: TabSaleScreen },
	Laporan: { screen: TabReportScreen }
}, TabNavigatorConfig)

const MyApp = DrawerNavigator({
	Home: {
		screen: StackNavigator({
			HomeScreen: {
				screen: HomeScreen,
				navigationOptions: {
					headerTitle: 'SCOUT - Franchise & POS',
					headerTintColor: 'white',
					/*headerStyle: {
						backgroundColor: '#6ecbe0'
					}*/
				}
			}
		})
	}
}, {
	contentComponent: ({ navigation }) => <SideMenu screenProps = { navigation } />
})

module.exports = MyApp