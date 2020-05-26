import React, {Component} from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import {ChatHeader} from '../../components/Headers';
import {translate} from '../../redux/reducers/languageReducer';
import {globalStyles} from '../../styles';

export default class ChannelChats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.navigation.getParam('data', null),
    };
  }
  componentDidMount() {
    // alert(JSON.stringify(this.state.data));
  }

  render() {
    const {data} = this.state;
    return (
      <View style={globalStyles.container}>
        <ChatHeader
          title={data.name}
          description={
            data.total_members + ' ' + translate('pages.xchat.followers')
          }
          onBackPress={() => this.props.navigation.goBack()}
          onRightIconPress={() => alert('more')}
        />
      </View>
    );
  }
}
