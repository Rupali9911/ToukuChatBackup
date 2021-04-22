import React, { Component } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const { width } = Dimensions.get('window');

export default class ViewSlider extends Component {
  constructor() {
    super();

    this.slidesCount = 0;
  }

  state = {
    step: 1,
    autoSlide: false,
  };

  static getDerivedStateFromProps(props) {
    return {
      step: props.hasOwnProperty('step') ? props.step : 1,
      autoSlide: props.hasOwnProperty('autoSlide') ? props.autoSlide : false,
    };
  }

  componentDidUpdate(props) {
    if (props.step !== this.state.step) {
      this.setStep(this.state.step);
    }
  }

  componentDidMount() {
    if (
      this.props.hasOwnProperty('renderSlides') &&
      this.props.renderSlides.hasOwnProperty('props') &&
      this.props.renderSlides.props.hasOwnProperty('children')
    ) {
      this.slidesCount = Object.keys(
        this.props.renderSlides.props.children,
      ).length;
    }

    if (this.props.autoSlide === true && this.scroll.scrollTo) {
      this.startAutoSlide();
    }

    if (this.props.hasOwnProperty('step')) {
      this.setStep(this.props.step);
    }

    if (this.props.hasOwnProperty('slidesCount')) {
      this.props.slidesCount(this.slidesCount);
    }
  }

  startAutoSlide = () => {
    const interval = this.props.slideInterval;

    if (interval < 1000) {
      console.warn('slideInterval time must be at least 1000 milisecond.');
    } else {
      const count = this.slidesCount;
      let step = 1;

      setInterval(() => {
        this.setStep(step + 1);

        if (count === step + 1) {
          step = 0;
        } else {
          step++;
        }
      }, interval);
    }
  };

  setStep = (step = 1) => {
    const scrollToX =
      this.slidesCount * width - (this.slidesCount - (step - 1)) * width;

    setTimeout(() => this.scroll && this.scroll.scrollTo({x: scrollToX}), 50);
  };

  onScrollCb = (index) => {
    if (this.props.hasOwnProperty('onScroll')) {
      this.props.onScroll(index);
    }
  };

  onMomentumScrollEnd = ({nativeEvent}) => {
    const index = Math.round(nativeEvent.contentOffset.x / width) + 1;

    this.setState({step: index}, this.onScrollCb(index));
  };

  render() {
    const { step } = this.state;
    return (
      <View style={[{width, height: this.props.height}, this.props.style]}>
        <ScrollView
          contentContainerStyle={{}}
          horizontal={true}
          pagingEnabled={true}
          ref={(node) => (this.scroll = node)}
          scrollEventThrottle={70}
          automaticallyAdjustContentInsets
          onMomentumScrollEnd={this.onMomentumScrollEnd}
          showsHorizontalScrollIndicator={false}>
          {this.props.renderSlides}
        </ScrollView>
        {this.slidesCount > 1 ?
          <View 
          pointerEvents={'box-none'}
          style={{
            position: 'absolute', 
            paddingHorizontal: 10,
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            overflow: 'hidden',
            width: '100%', 
            height: '100%'
          }}>
            {step>1?<FontAwesome name={'angle-left'} size={25} color={'#fff'} 
              style={{ padding: 10, backgroundColor: '#00000040' }} 
              onPress={()=>{this.setStep(step-1)}}
              />:<View />}
            {step<this.slidesCount?<FontAwesome name={'angle-right'} size={25} color={'#fff'} 
              style={{ padding: 10, backgroundColor: '#00000040' }} 
              onPress={()=>{this.setStep(step+1)}}
              />:<View />}
          </View>
          : null}
      </View>
    );
  }
}
