/*************************************************
 * SukraasLIS
 * @exports
 * @class CashPaymentSuccess.js
 * @extends Component
 * Created by Shiva Sankar on 01/07/2020
 * Copyright © 2020 SukraasLIS. All rights reserved.
 *************************************************/

'use strict';
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Constants from '../../util/Constants';
import HTML from 'react-native-render-html';

let amount = 0.0;
let discount = 0.0;
let total = 0.0;

class SummaryBottom extends Component {
  render() {
    return this._renderSubTotal();
  }

  constructor(props) {
    super(props);
    this.state = {
      cartAmount: 0,
      promoDiscount: 0,
      totalAmount: 0,
    };
  }

  componentWillMount() {
    this.setState({
      cartAmount: 0,
      promoDiscount: 0,
      totalAmount: 0,
    });
  }

  componentDidMount() {
    this.setState({
      cartAmount: 0,
      promoDiscount: 0,
      totalAmount: 0,
    });
    amount = 0.0;
    discount = 0.0;
    total = 0.0;
    for (var i = 0; i < this.props.data.length; i++) {
      amount += parseFloat(this.props.data[i].Service_Amount);
      discount += parseFloat(this.props.data[i].Service_Discount);
    }
    total = (amount - discount) + this.props.collectionCharge;
    this.setState({
      cartAmount: amount + this.props.collectionCharge,
      promoDiscount: discount,
      totalAmount: total,
    });
  }

  _renderSubTotal = () => {
    return (
      <View style={styles.totalView}>
        {this.state.promoDiscount > 0
          ? this._showPromoCodeAmount()
          : this._showSubTotalAmount()}
      </View>
    );
  };

  _showSubTotalAmount = () => {
    return (
      <View style={{paddingBottom: 10}}>
        {/* <View style={styles.subTotalView}>
          <Text style={styles.subTotalText}>Total Amount </Text>
          <View style={styles.cartItemText}>
            <HTML
              baseStyle={styles.cartItemText}
              source={{
                html: this.props.currency + ' ' + this.state.totalAmount
              }}
            />
          </View>
        </View> */}
         <View style={styles.subTotalView}>
          <Text style={styles.subTotalText}>Sub Total </Text>
          <View style={styles.cartItemText}>
            <HTML
              baseStyle={styles.cartItemText}
              source={{
                html: this.props.serviceDetail.Sub_Total.toFixed(2)
              }}
            />
          </View>
        </View>
        <View style={styles.subTotalView}>
          <Text style={styles.subTotalText}>Discount </Text>
          <View style={styles.cartItemText}>
            <HTML
              baseStyle={styles.cartItemText}
              source={{
                html: this.props.serviceDetail.Discount_Amount.toFixed(2)
              }}
            />
          </View>
        </View>
        <View style={styles.subTotalView}>
          <Text style={styles.subTotalText}>Net Amount </Text>
          <View style={styles.cartItemText}>
            <HTML
              baseStyle={styles.cartItemText}
              source={{
                html: this.props.serviceDetail.Net_Amount.toFixed(2)
              }}
            />
          </View>
        </View>
        <View style={styles.subTotalView}>
          <Text style={styles.subTotalText}>VAT Amount </Text>
          <View style={styles.cartItemText}>
            <HTML
              baseStyle={styles.cartItemText}
              source={{
                html: this.props.serviceDetail.VAT_Amount.toFixed(2)
              }}
            />
          </View>
        </View>
        <View style={styles.subTotalView}>
          <Text style={styles.subTotalText}>Total Bill Amount </Text>
          <View style={styles.cartItemText}>
            <HTML
              baseStyle={styles.cartItemText}
              source={{
                html: this.props.serviceDetail.Total_Bill_Amount.toFixed(2)
              }}
            />
          </View>
        </View>
        <View style={styles.subTotalView}>
          <Text style={styles.subTotalText}>Patient Amount </Text>
          <View style={styles.cartItemText}>
            <HTML
              baseStyle={styles.cartItemText}
              source={{
                html: this.props.serviceDetail.Patient_Amount.toFixed(2)
              }}
            />
          </View>
        </View>
        <View style={styles.subTotalView}>
          <Text style={styles.subTotalText}>Insurance Amount </Text>
          <View style={styles.cartItemText}>
            <HTML
              baseStyle={styles.cartItemText}
              source={{
                html: this.props.serviceDetail.Guar_Amount.toFixed(2)
              }}
            />
          </View>
        </View>
        <View style={styles.subTotalView}>
        <Text style={styles.subTotalText}>{`Offer ${this.props.serviceDetail?.Promo_Code ? `(${this.props.serviceDetail?.Promo_Code})` : ''}`}</Text>
          <View style={styles.cartItemText}>
            <HTML
              baseStyle={styles.cartItemText}
              source={{
                html: this.props.serviceDetail.Offer_Amount?.toFixed(2)
              }}
            />
          </View>
        </View>
        <View style={styles.subTotalView}>
          <Text style={styles.subTotalText}>Amount Paid </Text>
          <View style={styles.cartItemText}>
            <HTML
              baseStyle={styles.cartItemText}
              source={{
                html:  this.props.serviceDetail.Paid_Amount.toFixed(2)
              }}
            />
          </View>
        </View>
      </View>
    );
  };
  _showPromoCodeAmount = () => {
    return (
      <View>
        <View style={styles.subTotalView}>
          <Text style={styles.subTotalText}>Sub Total </Text>
          <View style={styles.cartItemText}>
            <HTML
              baseStyle={styles.cartItemText}
              source={{
                html: this.props.serviceDetail.Sub_Total.toFixed(2)
              }}
            />
          </View>
        </View>
        <View style={styles.subTotalView}>
          <Text style={styles.subTotalText}>Discount </Text>
          <View style={styles.cartItemText}>
            <HTML
              baseStyle={styles.cartItemText}
              source={{
                html: this.props.serviceDetail.Discount_Amount.toFixed(2)
              }}
            />
          </View>
        </View>
        <View style={styles.subTotalView}>
          <Text style={styles.subTotalText}>Net Amount </Text>
          <View style={styles.cartItemText}>
            <HTML
              baseStyle={styles.cartItemText}
              source={{
                html: this.props.serviceDetail.Net_Amount.toFixed(2)
              }}
            />
          </View>
        </View>
        <View style={styles.subTotalView}>
          <Text style={styles.subTotalText}>VAT Amount </Text>
          <View style={styles.cartItemText}>
            <HTML
              baseStyle={styles.cartItemText}
              source={{
                html: this.props.serviceDetail.VAT_Amount.toFixed(2)
              }}
            />
          </View>
        </View>
        <View style={styles.subTotalView}>
          <Text style={styles.subTotalText}>Total Bill Amount </Text>
          <View style={styles.cartItemText}>
            <HTML
              baseStyle={styles.cartItemText}
              source={{
                html: this.props.serviceDetail.Total_Bill_Amount.toFixed(2)
              }}
            />
          </View>
        </View>
        <View style={styles.subTotalView}>
          <Text style={styles.subTotalText}>Patient Amount </Text>
          <View style={styles.cartItemText}>
            <HTML
              baseStyle={styles.cartItemText}
              source={{
                html: this.props.serviceDetail.Patient_Amount.toFixed(2)
              }}
            />
          </View>
        </View>
        <View style={styles.subTotalView}>
          <Text style={styles.subTotalText}>Insurance Amount </Text>
          <View style={styles.cartItemText}>
            <HTML
              baseStyle={styles.cartItemText}
              source={{
                html: this.props.serviceDetail.Guar_Amount.toFixed(2)
              }}
            />
          </View>
        </View>
        <View style={styles.subTotalView}>
        <Text style={styles.subTotalText}>{`Offer ${this.props.serviceDetail?.Promo_Code ? `(${this.props.serviceDetail?.Promo_Code})` : ''}`}</Text>
          <View style={styles.cartItemText}>
            <HTML
              baseStyle={styles.cartItemText}
              source={{
                // html: this.state.promoDiscount.toFixed(2)
                html: this.props.serviceDetail.Offer_Amount.toFixed(2)
              }}
            />
          </View>
        </View>
        <View style={styles.subTotalView}>
          <Text style={styles.subTotalText}>Amount Paid </Text>
          <View style={styles.cartItemText}>
            <HTML
              baseStyle={styles.cartItemText}
              source={{
                html:  this.props.serviceDetail.Paid_Amount.toFixed(2)
              }}
            />
          </View>
        </View>
        {/* <View style={styles.subTotalView}>
          <Text style={styles.subTotalText}>Promo Code </Text>
          <View style={styles.cartItemText}>
            <HTML
              baseStyle={styles.cartItemText}
              source={{
                html: this.props.currency + ' ' + this.state.promoDiscount
              }}
            />
          </View>
        </View> */}
        {/* <View style={styles.subTotalView}>
          <Text style={styles.subTotalText}>Total Amount </Text>
          <View style={styles.cartItemText}>
            <HTML
              baseStyle={styles.cartItemText}
              source={{
                html: this.props.currency + ' ' + this.state.totalAmount.toFixed(2)
              }}
            />
          </View>
        </View> */}
      </View>
    );
  };
}

const styles = StyleSheet.create({
  totalView: {
    backgroundColor: Constants.COLOR.LAB_TOTAL_VIEW,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5
  },
  subTotalText: {
    flex: 2,
    color: '#6F6F6F',
    fontSize: Constants.FONT_SIZE.M,
    // alignSelf: 'center',
    alignSelf: 'flex-end',
    textAlign: 'right',
    alignContent: 'flex-end',
    alignItems: 'flex-end',
    marginRight: 5,
    fontFamily: Constants.FONT_FAMILY.FONT_FAMILY_POPPINS_REGULAR,
  },
  subTotalView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cartItemText: {
    flex: 1,
    // marginTop: 15,
    // marginBottom: 15,
    marginLeft: 15,
    marginRight: 15,
    fontSize: Constants.FONT_SIZE.M,
    // color: '#70BA6F',
    color: Constants.COLOR.LAB_SUB_TOTAL_FONT,
    alignItems: 'flex-end',
  },
});

export default SummaryBottom;
