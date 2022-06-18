import View from "../View";
import rain from "url:../../../imgs/raindrop.png";
import { LOAD_CURRENT_WEATHER } from "../../config";
import moment from "moment";

class HourlyWeatherView extends View {
  _parentElement = document.getElementById("hourly-panel");
  _sliderContent = document.getElementById("hourly-panel--content");
  _sliderElements = document.querySelectorAll(".hourly-chart");

  _renderHourlyWeather(data) {
    const loadData = () => {
      this._data = data;
      this._clearCurrent(this._sliderContent);
      const renderHourly = this._data
        .map((data, i) => {
          const hourly = this._generateMarkup(data);
          return hourly;
          // add join('') to remove commas
        })
        .join("");
      this._sliderContent.insertAdjacentHTML("afterbegin", renderHourly);

      // create grabbing slider affect to hourly content //

      let isPressedDown = false;
      let cursorX;

      this._parentElement.addEventListener("mousedown", (e) => {
        isPressedDown = true;
        cursorX = e.offsetX - this._sliderContent.offsetLeft;
        console.log(e.offsetX - this._sliderContent.offsetLeft);
        this._parentElement.style.cursor = "grabbing";
      });
      window.addEventListener("mouseup", () => {
        isPressedDown = false;
      });
      this._parentElement.addEventListener("mouseup", (e) => {
        this._parentElement.style.cursor = "grab";
      });

      this._parentElement.addEventListener("mousemove", (e) => {
        if (!isPressedDown) return;
        e.preventDefault();
        this._sliderContent.style.left = `${e.offsetX - cursorX}px`;
        boundingHourlyRec();
      });
      const boundingHourlyRec = () => {
        const boundingContainer = this._parentElement.getBoundingClientRect();
        const boundingSlides = this._sliderContent.getBoundingClientRect();
        if (parseInt(this._sliderContent.style.left) > 0) {
          this._sliderContent.style.left = 0;
        } else if (boundingSlides.right < boundingContainer.right) {
          this._sliderContent.style.left = `-${
            boundingSlides.width - boundingContainer.width
          }px`;
        }
      };
    };
    setTimeout(loadData, LOAD_CURRENT_WEATHER);
  }
  _generateMarkup(data) {
    return ` <div class="hourly-chart flex">
      <span class="hourly-chart--time"> ${moment(data.hour).format("LT")}</span>
      <span> <img class="hourly-weather--icon" src="${data.img}"
              alt="hourly weather logo"></span>
      <span class="fahren"> ${data.degreeF}</span>
      <span class="celsius hidden"> ${data.degreeC}</span>
      <div class="hourly-rain--container">
          <img src="${rain}" alt="rain image"><span> ${data.rainChance}</span>
      </div>
      </div>`;
  }
}

export default new HourlyWeatherView();
