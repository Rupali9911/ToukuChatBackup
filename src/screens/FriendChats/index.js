import React, { Component } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import { ChatHeader } from '../../components/Headers';
import { translate } from '../../redux/reducers/languageReducer';
import { globalStyles } from '../../styles';
import { getAvatar } from '../../utils';
import { Colors, Fonts, Images, Icons } from '../../constants';
import ChatMessageBox from '../../components/ChatMessageBox';
import { ScrollView } from 'react-native-gesture-handler';

export default class FriendChats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.navigation.getParam('data', null),
    };
  }
  componentDidMount() {}

  render() {
    const { data } = this.state;
    return (
      <ImageBackground
        source={Images.image_home_bg}
        style={globalStyles.container}
      >
        <ChatHeader
          title={data.username}
          description={
            data.total_members + ' ' + translate('pages.xchat.members')
          }
          type={'friend'}
          image={getAvatar(data.profile_picture)}
          onBackPress={() => this.props.navigation.goBack()}
          onRightIconPress={() => alert('more')}
        />
        <View style={{ flex: 0.9 }}>
          <ScrollView>
            <View style={{ alignItems: 'center', marginVertical: 15 }}>
              <View
                style={{
                  backgroundColor: Colors.orange,
                  paddingVertical: 4,
                  paddingHorizontal: 5,
                  borderRadius: 100,
                }}
              >
                <Text
                  style={{
                    color: Colors.white,
                    fontFamily: Fonts.medium,
                    fontSize: 12,
                  }}
                >
                  28/05
                </Text>
              </View>
            </View>
            <ChatMessageBox message="Hello" isUser />
            <ChatMessageBox message="HI" />
            <ChatMessageBox
              message="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. "
              isUser
            />
            <ChatMessageBox message="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. " />
            <ChatMessageBox
              message="Not Raju Not Raju Not Raju Not Raju"
              isUser
            />
          </ScrollView>
        </View>
        <View style={{ flex: 0.1 }}></View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({});
