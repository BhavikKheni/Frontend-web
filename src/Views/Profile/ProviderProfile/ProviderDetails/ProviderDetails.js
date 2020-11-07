import React from 'react';
import ImageComponent from "../../../../Components/Forms/Image";
import TypographyComponent from "../../../../Components/Typography/Typography";
import CheckIcon from "@material-ui/icons/Check";
import { languages_level } from "../../../../utils";
import { themes } from "../../../../themes";
import "../ProviderProfile.css";

const ProviderDetails = ({userData, allLanguages}) => {
  return (
    <div className="user_profile_updated_value">
      <div className="user_profile_img">
        <div className="user_profile_img_block">
          {userData.image && userData.image ? (
            <img alt="profile" src={userData.image} />
          ) : (
            <ImageComponent />
          )}
        </div>
      </div>
      <div className="user_language_timezone">
        <TypographyComponent
          variant="h3"
          title={`${userData.first_name} ${userData.last_name}`}
          style={{
            color: themes.default.colors.darkGray,
          }}
        />
        <div className="user_country_timezone_title">
          <TypographyComponent
            variant="h6"
            title={userData.country_name || ""}
          />
          <TypographyComponent
            variant="h6"
            title={userData.timezone_name || ""}
          />
        </div>
        <div className="user_country_timezone_data">
          {userData.languages &&
            userData.languages.map((language, i) => {
              let language_name =
                allLanguages &&
                allLanguages.find(
                  (x) =>
                    Number(x.id_language) === Number(language.language_id)
                );
              const label =
                languages_level &&
                languages_level.find(
                  (x) =>
                    Number(x.language_level_id) ===
                    Number(language.language_level_id)
                );
              return (
                <div className="user_language_item" key={i}>
                  <span className="user_language">
                    {language_name ? language_name.language_name : ""}
                  </span>
                  <span>{label ? label.label : ""}</span>
                </div>
              );
            })}
        </div>
      </div>
      <div className="user_verification">
        <TypographyComponent variant="h4" title="Employer Verfication" />
        <div className="user_verification_item">
          <CheckIcon />
          <TypographyComponent
            variant="h5"
            title={userData.member_since}
          />
        </div>
        <div className="user_verification_item">
          <CheckIcon />
          <TypographyComponent variant="h5" title="E-Mail verified" />
        </div>
      </div>
    </div>
  )
}

export default ProviderDetails;
