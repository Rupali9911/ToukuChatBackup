import React, {Component} from 'react';
import {View, Image, TouchableOpacity, Text, FlatList} from 'react-native';

import {getImage, eventService, normalize} from '../utils';
import {Images, Icons, Colors, Fonts, SocketEvents} from '../constants';
import Button from '../components/Button';
import NoData from '../components/NoData';
import {ListLoader, ImageLoader} from '../components/Loaders';
import TextAreaWithTitle from '../components/TextInputs/TextAreaWithTitle';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {translate, setI18nConfig} from '../redux/reducers/languageReducer';
import moment from 'moment';

export default class CommonNotes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };
  }

  componentDidMount() {}

  getDate = (date) => {
    return moment(date).format('MM/DD/YYYY HH:mm');
  };

  render() {
    const {text} = this.state;
    const {
      data,
      onPost,
      onEdit,
      onDelete,
      showTextBox,
      onAdd,
      onCancel,
      editNoteIndex,
      userData,
    } = this.props;
    return (
      <React.Fragment>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}>
          <Text
            style={{
              color: Colors.black,
              fontFamily: Fonts.regular,
              fontWeight: '400',
              fontSize: normalize(12),
            }}>
            {translate(`pages.xchat.notes`)}{' '}
            <Text
              style={{
                color: '#e26161',
                fontFamily: Fonts.regular,
                fontWeight: '400',
                fontSize: normalize(12),
              }}>
              {data ? data.count : 0}
            </Text>
          </Text>

          <TouchableOpacity
            style={{alignSelf: 'flex-end'}}
            onPress={() => onAdd()}>
            <Image
              source={Icons.plus_icon_select}
              resizeMode={'cover'}
              style={[{height: 20, width: 20}]}
            />
          </TouchableOpacity>
        </View>
        <View>
          {showTextBox && (
            <>
              <TextAreaWithTitle
                onChangeText={(text) => this.setState({text})}
                value={text}
                rightTitle={`${text.length}/300`}
                maxLength={300}
                placeholder={translate('pages.xchat.addNewNote')}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                  // flex: 0.5,
                  marginTop: 10,
                  height: 30,
                  width: '100%',
                }}>
                <View
                  style={{
                    marginHorizontal: 5,
                    // width: 60,
                  }}>
                  <Button
                    title={translate('common.cancel')}
                    type={'secondary'}
                    onPress={() => {
                      onCancel();
                      this.setState({text: ''});
                    }}
                    height={30}
                    isRounded={false}
                  />
                </View>
                <View
                  style={{
                    // width: 60,
                    marginHorizontal: 5,
                  }}>
                  <Button
                    title={translate('pages.xchat.post')}
                    type={'primary'}
                    onPress={() => {
                      console.log('post pressed');
                      onPost(text);
                      this.setState({text: ''});
                    }}
                    height={30}
                    isRounded={false}
                    disabled={!text}
                    // loading={isLoading}
                  />
                </View>
              </View>
            </>
          )}
          {data && data.results.length > 0 ? (
            <FlatList
              keyExtractor={(item, index) => index.toString()}
              data={data.results}
              renderItem={({item, index}) =>
                index !== editNoteIndex ? (
                  <View
                    style={{
                      borderBottomColor: Colors.light_gray,
                      borderBottomWidth: 0.5,
                      marginBottom: 10,
                      paddingBottom: 2,
                    }}>
                    <View style={{marginBottom: 5}}>
                      <Text
                        style={{
                          color: Colors.black,
                          fontFamily: Fonts.regular,
                          fontWeight: '400',
                          fontSize: normalize(10),
                        }}>
                        {item.text}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={{
                            marginRight: 5,
                            color: '#e26161',
                            fontFamily: Fonts.regular,
                            fontWeight: '400',
                            fontSize: normalize(10),
                          }}>
                          {item.created_by_username}
                        </Text>
                        <Text
                          style={{
                            marginLeft: 5,
                            color: '#6c757dc7',
                            fontFamily: Fonts.regular,
                            fontWeight: '400',
                            fontSize: normalize(10),
                          }}>
                          {this.getDate(item.updated)}
                        </Text>
                      </View>
                      {userData.id === item.created_by && (
                        <View style={{flexDirection: 'row'}}>
                          <FontAwesome5
                            name={'pencil-alt'}
                            size={14}
                            color={Colors.black}
                            style={{marginRight: 5}}
                            onPress={() => {
                              onEdit(index, item);
                              this.setState({text: item.text});
                            }}
                          />
                          <FontAwesome5
                            name={'trash'}
                            size={14}
                            color={Colors.black}
                            style={{marginLeft: 5}}
                            onPress={() => {
                              onDelete(index, item);
                            }}
                          />
                        </View>
                      )}
                    </View>
                  </View>
                ) : (
                  <View
                    style={{
                      borderBottomColor: Colors.black_light,
                      borderBottomWidth: 0.5,
                      marginBottom: 10,
                      paddingBottom: 2,
                    }}>
                    <TextAreaWithTitle
                      onChangeText={(text) => this.setState({text})}
                      value={text}
                      rightTitle={`${text.length}/300`}
                      maxLength={300}
                    />
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end',
                        // flex: 0.5,
                        marginTop: 10,
                        height: 30,
                        width: '100%',
                      }}>
                      <View
                        style={{
                          marginHorizontal: 5,
                          // width: 60,
                        }}>
                        <Button
                          title={translate('common.cancel')}
                          type={'secondary'}
                          onPress={() => {
                            onCancel(), this.setState({text: ''});
                          }}
                          height={30}
                          isRounded={false}
                        />
                      </View>
                      <View
                        style={{
                          // width: 60,
                          marginHorizontal: 5,
                        }}>
                        <Button
                          title={translate('pages.xchat.update')}
                          type={'primary'}
                          onPress={() => {
                            console.log('post pressed');
                            onPost(text);
                            this.setState({text: ''});
                          }}
                          height={30}
                          isRounded={false}
                          disabled={!text}
                          // loading={isLoading}
                        />
                      </View>
                    </View>
                  </View>
                )
              }
              // ListFooterComponent={() => (
              //   <View>{loading ? <ListLoader /> : null}</View>
              // )}
            />
          ) : (
            !showTextBox && (
              <View>
                <NoData
                  title={translate('pages.xchat.noNotesFound')}
                  style={{paddingBottom: 0}}
                />
                <NoData
                  title={translate('pages.xchat.notesFoundText')}
                  style={{paddingTop: 0}}
                  textStyle={{marginTop: 0}}
                />
              </View>
            )
          )}
        </View>
      </React.Fragment>
    );
  }
}
