import React, { useContext } from 'react'
import { WeatherInfoContext } from '../../provider/WeatherInfoProvider';
import { ModalContext } from '../../provider/ModalProvider';
import WeatherIcon from './WeatherIcon';
import { getTime } from '../../timeFns/getTime'
import '../../css/comp-css/weather-section/weatherDayCard.css'

const WeatherDayCard = ({ day, isPresentDay, index }) => {
    const { _selectedWeatherDay, _units, _targetLocation } = useContext(WeatherInfoContext);
    const { _isSelectedWeatherModalOn } = useContext(ModalContext);
    const [targetLocation] = _targetLocation
    const [isSelectedWeatherModalOn, setIsSelectedWeatherModalOn] = _isSelectedWeatherModalOn;
    const [selectedWeatherDay, setSelectedWeatherDay] = _selectedWeatherDay;
    const { temp: tempUnits } = _units[0];
    const { weather, feels_like, averageForTheDay, temp, dt } = day ?? {};
    // const date = isPresentDay ? currentDate : getDate(index + 1);
    const date = getTime(dt, targetLocation.timeZoneOffset, 'dddd, MMM Do YYYY')
    const { min, max } = averageForTheDay?.temp ?? temp;
    const { icon: weatherIcon, description } = weather[0] ?? {};
    const weatherDayCardCss = isPresentDay ? 'weatherDayCard presentDay' : 'weatherDayCard daily'
    const weatherDescriptionSecCss = isPresentDay ? 'weatherDescriptionSec' : 'weatherDescriptionSec daily'

    const handleWeatherDayClick = () => {
        setIsSelectedWeatherModalOn(true);
        setSelectedWeatherDay({ ...day, date, isPresentDay: isPresentDay });
    };


    return (
        <div className={weatherDayCardCss} onClick={handleWeatherDayClick} key={index}>
            <section>
                <h1>{date}</h1>
            </section>
            <section className='weatherDayCardIcon'>
                <WeatherIcon weatherIcon={weatherIcon} />
            </section>
            <section className={weatherDescriptionSecCss}>
                {isPresentDay &&
                    <>
                        <span>Current temp:</span>
                        <span>{Math.round(temp)} {tempUnits}</span>
                    </>
                }
                {isPresentDay ?
                    <span>Feels like {Math.round(feels_like)} {tempUnits}. <span className='weatherDescription'>{description}.</span></span>
                    :
                    <span>{description}</span>
                }
            </section>
            <section className='highAndLowTempSection'>
                <div>
                    <span>High:</span>
                    <span>{Math.round(max)} {tempUnits}</span>
                </div>
                <div>
                    <span>Low:</span>
                    <span>{Math.round(min)} {tempUnits}</span>
                </div>
            </section>
        </div>
    )
}
export default WeatherDayCard;