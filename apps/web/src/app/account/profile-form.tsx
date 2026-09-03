"use client";

import { Camera, CheckCircle2, LoaderCircle, LockKeyhole, Mail, Phone, Save, UserRound, X } from "lucide-react";
import { ChangeEvent, useActionState, useEffect, useRef, useState } from "react";

import { requestEmailChange, requestPhoneChange, updateAvatar, updateProfile, verifyPhoneChange } from "./actions";
import { initialProfileState, type ProfileActionState } from "./profile-state";

type ProfileFormProps = {
  avatarUrl: string | null;
  contactPhone: string;
  email: string | null;
  firstName: string;
  lastName: string;
  verifiedPhone: string | null;
};

function FormMessage({ state }: { state: ProfileActionState }) {
  if (!state.message) return null;
  return <div aria-live="polite" className={`auth-message auth-message-${state.status}`} role={state.status === "error" ? "alert" : "status"}>{state.message}</div>;
}

export function ProfileForm({ avatarUrl, contactPhone, email, firstName, lastName, verifiedPhone }: ProfileFormProps) {
  const [profileState, profileAction, profilePending] = useActionState(updateProfile, initialProfileState);
  const [avatarState, avatarAction, avatarPending] = useActionState(updateAvatar, initialProfileState);
  const [emailState, emailAction, emailPending] = useActionState(requestEmailChange, initialProfileState);
  const [phoneState, phoneAction, phonePending] = useActionState(requestPhoneChange, initialProfileState);
  const [verifyState, verifyAction, verifyPending] = useActionState(verifyPhoneChange, initialProfileState);
  const [avatarPreview, setAvatarPreview] = useState(avatarUrl);
  const [avatarFileName, setAvatarFileName] = useState("");
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const avatarObjectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    setAvatarPreview(avatarUrl);
    return () => {
      if (avatarObjectUrlRef.current) URL.revokeObjectURL(avatarObjectUrlRef.current);
    };
  }, [avatarUrl]);

  function previewAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (avatarObjectUrlRef.current) URL.revokeObjectURL(avatarObjectUrlRef.current);
    const objectUrl = URL.createObjectURL(file);
    avatarObjectUrlRef.current = objectUrl;
    setAvatarPreview(objectUrl);
    setAvatarFileName(file.name);
  }

  function cancelAvatarSelection() {
    if (avatarObjectUrlRef.current) URL.revokeObjectURL(avatarObjectUrlRef.current);
    avatarObjectUrlRef.current = null;
    if (avatarInputRef.current) avatarInputRef.current.value = "";
    setAvatarPreview(avatarUrl);
    setAvatarFileName("");
  }

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "DS";
  const pendingPhone = phoneState.pendingValue ?? verifyState.pendingValue;

  return (
    <div className="profile-settings">
      <form action={avatarAction} className="profile-card profile-avatar-card">
        <div className="profile-avatar-preview" aria-hidden>
          {avatarPreview ? <img alt="" src={avatarPreview} /> : <span>{initials}</span>}
        </div>
        <div className="profile-card-copy">
          <h3>Фото профілю</h3>
          <p>JPG, PNG або WebP до 3 МБ.</p>
          <div className="profile-file-actions">
            <label className="profile-file-button">
              <Camera aria-hidden size={17} /> {avatarFileName || "Обрати фото"}
              <input accept="image/jpeg,image/png,image/webp" name="avatar" onChange={previewAvatar} ref={avatarInputRef} required type="file" />
            </label>
            {avatarFileName ? (
              <button aria-label="Скасувати вибір фото" className="profile-file-cancel" onClick={cancelAvatarSelection} type="button">
                <X aria-hidden size={17} />
              </button>
            ) : null}
          </div>
        </div>
        <button className="profile-save-button profile-compact-button" disabled={avatarPending} type="submit">
          {avatarPending ? <LoaderCircle aria-hidden className="auth-spinner" size={18} /> : <Save aria-hidden size={18} />} Зберегти фото
        </button>
        <FormMessage state={avatarState} />
      </form>

      <form action={profileAction} className="profile-card profile-form">
        <div className="profile-card-heading">
          <span><UserRound aria-hidden size={19} /></span>
          <div><h3>Особисті дані</h3><p>Використовуються під час оформлення замовлення.</p></div>
        </div>
        <div className="profile-fields">
          <label className="auth-field"><span>Ім’я</span><span className="auth-input-wrap"><input autoComplete="given-name" defaultValue={firstName} maxLength={80} minLength={2} name="firstName" placeholder="Ваше ім’я" required type="text" /></span></label>
          <label className="auth-field"><span>Прізвище</span><span className="auth-input-wrap"><input autoComplete="family-name" defaultValue={lastName} maxLength={80} name="lastName" placeholder="Ваше прізвище" type="text" /></span></label>
          <label className="auth-field profile-field-wide"><span>Телефон для замовлень</span><span className="auth-input-wrap"><Phone aria-hidden size={18} /><input autoComplete="tel" defaultValue={contactPhone} inputMode="tel" maxLength={24} name="contactPhone" placeholder="+380 00 000 00 00" type="tel" /></span><small>Можна змінювати без SMS — це лише контакт для доставки.</small></label>
        </div>
        <FormMessage state={profileState} />
        <button className="profile-save-button" disabled={profilePending} type="submit">{profilePending ? <LoaderCircle aria-hidden className="auth-spinner" size={18} /> : <Save aria-hidden size={18} />} Зберегти дані</button>
      </form>

      <div className="profile-card profile-security-card">
        <div className="profile-card-heading">
          <span><LockKeyhole aria-hidden size={19} /></span>
          <div><h3>Контакти для входу</h3><p>Нове значення стане активним лише після підтвердження.</p></div>
        </div>
        <form action={emailAction} className="profile-contact-form">
          <div className="profile-contact-status"><Mail aria-hidden size={19} /><div><span>Email</span><strong>{email ?? "Не додано"}</strong></div>{email ? <em><CheckCircle2 aria-hidden size={15} /> Підтверджено</em> : null}</div>
          <label className="auth-field"><span>Новий email</span><span className="auth-input-wrap"><Mail aria-hidden size={18} /><input autoComplete="email" inputMode="email" name="email" placeholder="name@example.com" required type="email" /></span></label>
          <button className="profile-secondary-button" disabled={emailPending} type="submit">{emailPending ? <LoaderCircle aria-hidden className="auth-spinner" size={17} /> : null} Надіслати підтвердження</button>
          <FormMessage state={emailState} />
        </form>
        <form action={phoneAction} className="profile-contact-form">
          <div className="profile-contact-status"><Phone aria-hidden size={19} /><div><span>Номер для входу</span><strong>{verifiedPhone ?? "Не додано"}</strong></div>{verifiedPhone ? <em><CheckCircle2 aria-hidden size={15} /> Підтверджено</em> : null}</div>
          <label className="auth-field"><span>Новий номер</span><span className="auth-input-wrap"><Phone aria-hidden size={18} /><input autoComplete="tel" inputMode="tel" name="phone" placeholder="+380 00 000 00 00" required type="tel" /></span></label>
          <button className="profile-secondary-button" disabled={phonePending} type="submit">{phonePending ? <LoaderCircle aria-hidden className="auth-spinner" size={17} /> : null} Отримати SMS-код</button>
          <FormMessage state={phoneState} />
        </form>
        {pendingPhone ? (
          <form action={verifyAction} className="profile-code-form">
            <input name="phone" type="hidden" value={pendingPhone} />
            <label className="auth-field"><span>Код із SMS для {pendingPhone}</span><span className="auth-input-wrap"><input autoComplete="one-time-code" inputMode="numeric" maxLength={6} minLength={6} name="token" pattern="[0-9]{6}" placeholder="000000" required type="text" /></span></label>
            <button className="profile-save-button" disabled={verifyPending} type="submit">{verifyPending ? <LoaderCircle aria-hidden className="auth-spinner" size={17} /> : <CheckCircle2 aria-hidden size={17} />} Підтвердити номер</button>
            <FormMessage state={verifyState} />
          </form>
        ) : null}
      </div>
    </div>
  );
}
