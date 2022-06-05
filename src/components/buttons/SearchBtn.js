import React, { useContext, useEffect } from 'react'
import { getUserCityName } from '../../apiFns/getUserCityName';
import { getWeather } from '../../apiFns/getWeather'
import { SearchContext } from '../../provider/SearchProvider';
import { WeatherInfoContext } from '../../provider/WeatherInfoProvider';
import { getDate } from '../../timeFns/getDate';
import { getTimeOfLocation } from '../../timeFns/getTimeOfLocation';
import { BiSearch } from "react-icons/bi";



const SearchBtn = ({ isOnSmallerScreen }) => {
    const { _isLoadingScreenOn, _isWeatherDataReceived, _currentDate, _weather, _targetLocation, _longAndLat, _isGettingUserLocation, _units, _longAndLatOfDisplayedWeather } = useContext(WeatherInfoContext)
    const { _searchInput, _placeHolderTxt } = useContext(SearchContext);
    const [units] = _units;
    const [placeHolderTxt] = _placeHolderTxt;
    const [longAndLatOfDisplayedWeather, setLongAndLatOfDisplayedWeather] = _longAndLatOfDisplayedWeather;
    const [isGettingUserLocation] = _isGettingUserLocation;
    const [searchInput,] = _searchInput;
    const [longAndLat,] = _longAndLat;
    const [, setWeather] = _weather;
    const [targetLocation, setTargetLocation] = _targetLocation;
    const [currentDate, setCurrentDate] = _currentDate;
    const [isLoadingScreenOn, setIsLoadingScreenOn] = _isLoadingScreenOn;
    const [isWeatherDataReceived, setIsWeatherDataReceived] = _isWeatherDataReceived;
    const isOnUserLocationSearch = placeHolderTxt === "Using your location. Press the 'search' icon to get results";
    const isButtonDisabled = ((isOnUserLocationSearch && !navigator?.geolocation) || isGettingUserLocation || ((searchInput.length <= 2) && !isOnUserLocationSearch)) ? true : false;
    const isOnImperial = units.temp === '°F'




    const _getWeather = locationName => {
        getWeather(longAndLat, isOnImperial)
            .then(response => {
                const { weather, didError, errorMsg } = response;
                if (didError) {
                    console.error('An error has occurred in getting weather of target location. Error message: ', errorMsg);
                    alert('An error has occurred in getting weather of target location.')
                    return;
                };
                if (!weather) {
                    alert('Something went wrong, please refresh the page and try again.')
                    return;
                }

                console.log(
                    `weather: `, weather
                )
                const { daily, timezone, current, timezone_offset } = weather;

                const { temp, feels_like, weather: weatherMoreInfo, humidity, sunrise, sunset, wind_speed, rain, snow, dew_point } = daily[0];
                daily.shift();
                daily.pop();
                setWeather({ daily, current: { ...current, averageForTheDay: { temp, feels_like, weather: weatherMoreInfo, humidity, sunrise, sunset, wind_speed, rain, snow, dewPoint: dew_point } } })
                setCurrentDate(getDate())
                setTargetLocation(targetLocation => {
                    return {
                        ...targetLocation,
                        name: locationName ?? searchInput,
                        time: getTimeOfLocation(timezone),
                        timeZoneOffset: timezone_offset
                    }
                });
                setIsLoadingScreenOn(false);
                setIsWeatherDataReceived(true);
                setLongAndLatOfDisplayedWeather(longAndLat);
            })
    };


    if (isOnUserLocationSearch) {
        var handleSearchBtnClick = () => {
            if (!longAndLat) {
                alert("Couldn't get your location. Either your browser doesn't support geolocation or you have disabled location access from your computer.")
                return;
            }
            setIsWeatherDataReceived(false);
            setIsLoadingScreenOn(true);
            getUserCityName(longAndLat).then(location => {
                const { country, state, name } = location;
                if (state) {
                    var _location = `${name}, ${state}, ${country}`
                } else if (state && country) {
                    _location = `${state}, ${country}`;
                } else if (country) {
                    _location = country
                } else {
                    _location = "Unable to get your location. "
                }
                _getWeather(_location);
                setLongAndLatOfDisplayedWeather(longAndLat);
            })
        }
    } else if (placeHolderTxt === 'Search by address, city name, or zip code') {
        handleSearchBtnClick = () => {
            setIsWeatherDataReceived(false);
            setIsLoadingScreenOn(true);
            _getWeather();
        };
    }



    return (
        <button
            disabled={isButtonDisabled}
            onClick={handleSearchBtnClick}
        >
            {!isOnSmallerScreen ?
                (isGettingUserLocation ? 'Getting location...' : 'Search')
                :
                <BiSearch />
            }
        </button>
    )
}

export default SearchBtn