import React from 'react';
import IProfile from '@/interfaces/IProfile.ts';
import { PDP, setCookie } from '@/utils/Common.ts';

/**
 * Renders a login card for a given profile.
 * @param {Object} props - The component props.
 * @param {IProfile} props.profile - The profile to render the login card for.
 * @param {number} props.keyX - The key of the login card.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} props.setOpenLogin - The state setter for the login modal.
 * @param {React.Dispatch<React.SetStateAction<IProfile | undefined>>} props.setSelectedProfile - The state setter for the selected profile.
 * @returns {JSX.Element} The login card component.
 */
export function LoginCard({ profile, keyX, setOpenLogin, setSelectedProfile }: {
    profile: IProfile,
    keyX: number,
    setOpenLogin: React.Dispatch<React.SetStateAction<boolean>>,
    setSelectedProfile: React.Dispatch<React.SetStateAction<IProfile | undefined>>;
}): JSX.Element {
    return (
        <div onClick={
            async () => {
                if (profile.passcode) {
                    setSelectedProfile(profile);
                    setOpenLogin(true);
                } else {
                    await fetch(PDP + "/profile/login/" + profile.name + "/" + "_nopasswordisusedforthisaccount_", { 'cache': 'no-cache' }).then(function (response) {
                        return response.text();
                    }).then(function (data) {
                        if (!data.includes("404")) {
                            setCookie('selectedProfile', data, 2, document);
                            window.location.href = "collectionner";
                        }
                    });
                }
            }
        } id={String(keyX)} className="login_elements">
            <img src={profile.image} className="profile_image" alt={profile.name} />
            <h3>{profile.name}</h3>
        </div>
    );
}
