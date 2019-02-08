/**
 * Created by Alex on 12/8/15.
 */
var React = require('react-native');
var {
		StyleSheet,
		View,
		Image,
		Text,
		ListView,
		Platform,
		TextInput,
		LayoutAnimation,
		TouchableHighlight,
		ScrollView,
		Component,
		TouchableOpacity
} = React;

var EventEmitter = require('EventEmitter');
var Subscribable = require("Subscribable");

var CallMessage=require('../components/CallMessage.js');
var ScheduledCallsListController = require('./ScheduledCallsListController.js');
var {bp, vw, vh} = require('react-native-relative-units')(100);
var globalStyles=require('../../common/styles/styles.js');
var styles=require('./styles.js');
var LoadingModal = require('../../../components/LoadingModal');
var moment = require('moment-timezone');

var Actions = require('react-native-router-flux').Actions;
import InvertibleScrollView from 'react-native-invertible-scroll-view';

var SideMenu = require('react-native-side-menu');

const FilterMenu = require('../FilterMenu.js');

const MK = require('react-native-material-kit');
const {
  MKButton,
  MKColor,
  MKTextField,
  mdl,
} = MK;

const Textfield = MKTextField.textfield()
	.withHighlightColor(MKColor.Green)
  	.build();

// Custom Components
var ColoredRaisedButton = MKButton.coloredButton().build();
var ColorRoundButton = MKButton.colorRoundButton().build();

var ScheduledCallsListPage = React.createClass({
	mixins: [Subscribable.Mixin],
	componentWillMount: function() {
		ScheduledCallsListController.getData();
	},
	componentDidMount: function() {
		this.addListenerOn(this.props.events, "myRightFilterButtonClicked", this.rightFilterButtonNav);
	},
	rightFilterButtonNav: function () {
		var filter_button = this.refs.filter_button;
    	filter_button.context.menuActions.toggle();
	},
	getInitialState: function() {
		ScheduledCallsListController.setViewController(this);
		var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		return {
			isModalOpen: true,
			dataSource: ds.cloneWithRows([]),
			height: 0,
			text: '',
			touchToClose: false
		}
	},
	handleOpenWithTouchToClose: function() {
    	this.setState({
      		touchToClose: true,
    	});
  	},
  	handleChange: function(isOpen) {
	    if (!isOpen) {
	      this.setState({
	        touchToClose: false,
	      });
	    }
  	},
  	convertSecondsToMinutes: function(seconds) {
        if(seconds >= 60) return parseFloat(moment.duration(parseInt(seconds), 'seconds').asMinutes()).toFixed(2)+" minutes";
        else return seconds + ' seconds';
    },
	_renderRow: function(rowData, rowID: number) {
	    return (
	    	<CallMessage row={rowData} rowId={rowID} />
	    );
	},
	render: function() {
		var filterMenu = <FilterMenu navigator={navigator}/>;
		return (
		    <SideMenu menu={filterMenu}
					menuPosition='right'
		       		touchToClose={this.state.touchToClose}
		       		onChange={this.handleChange}>
			<View style={[styles.container, globalStyles.container]}>
				<LoadingModal isVisible={this.state.isModalOpen}>
		       	</LoadingModal>
		       	
				<View style={{height: 0}}><Button ref="filter_button">FILTER</Button></View>
				<View style={[styles.full_width, {flex:1, flexDirection: 'row', justifyContent: 'flex-start'}]}>
					
					<View style={styles.conversations_holder}>
						<ListView
					      	renderScrollComponent={props => <InvertibleScrollView {...props} />}
					      	dataSource={this.state.dataSource}
					      	renderRow={this._renderRow}
					    />
					</View>
				</View>
		    </View>
			</SideMenu>
		);

	}
});

class Button extends Component {
  handlePress(e) {
    this.context.menuActions.toggle();
    if (this.props.onPress) {
      this.props.onPress(e);
    }
  }

  render() {
    return (
      <TouchableOpacity
        onPress={this.handlePress.bind(this)}
        style={this.props.style}>
        <Text style={{color: '#fff', textAlign:'center'}}>{this.props.children}</Text>
      </TouchableOpacity>
    );
  }
}

Button.contextTypes = {
  menuActions: React.PropTypes.object.isRequired
};
module.exports = ScheduledCallsListPage;