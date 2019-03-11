import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  KeyboardAvoidingView,
  StatusBar,
  ImageBackground,
  ActivityIndicator
} from "react-native";
import SearchInput from "./components/SearchInput";
import { fetchLocationId, fetchWeather } from "./utils/api";
import getImageForWeather from "./utils/getImageForWeather";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      location: "", //San Francisco
      error: false,
      temperature: 0,
      weather: ""
    };
  }

  componentDidMount() {
    //console.log("Component has mounted!");
  }

  handleUpdateLocation = async city => {
    if (!city) return;
    this.setState(
      {
        loading: true
      },
      async () => {
        try {
          const locationId = await fetchLocationId(city);
          const { location, weather, temperature } = await fetchWeather(
            locationId
          );

          this.setState({
            loading: false,
            error: false,
            location,
            weather,
            temperature
          });
        } catch (e) {
          this.setState({
            loading: false,
            error: true
          });
        }
      }
    );
  };

  render() {
    const { location, loading, weather, temperature, error } = this.state;
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <StatusBar barStyle="light-content" />
        <ImageBackground
          source={getImageForWeather("Clear")}
          style={styles.imageContainer}
          imageStyle={styles.image}
        >
          <View style={styles.detailContainer}>
            <ActivityIndicator animating={loading} color="white" size="large" />
            {!loading && (
              <View>
                {error && (
                  <Text style={[styles.smallText, styles.textStyle]}>
                    Could not load weather, please try a different city.{" "}
                  </Text>
                )}
                {!error && (
                  <View>
                    <Text style={[styles.largeText, styles.textStyle]}>
                      {location}
                    </Text>
                    <Text style={[styles.smallText, styles.textStyle]}>
                      {weather}
                    </Text>
                    <Text style={[styles.largeText, styles.textStyle]}>
                      {`${Math.round(temperature)}°`}
                    </Text>
                  </View>
                )}
              </View>
            )}

            <SearchInput
              placeholder="Search any city"
              onSubmit={this.handleUpdateLocation}
            />
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#34495E",
    alignItems: "center",
    justifyContent: "center"
  },
  detailContainer: {
    justifyContent: "center",
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingHorizontal: 20
  },
  textStyle: {
    textAlign: "center",
    ...Platform.select({
      ios: {
        fontFamily: "AvenirNext-Regular"
      },
      android: {
        fontFamily: "Roboto"
      }
    })
  },
  largeText: {
    fontSize: 44
  },
  smallText: {
    fontSize: 18
  },
  imageContainer: {
    flex: 1
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "cover"
  }
});
