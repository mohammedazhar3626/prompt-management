import { FormEvent, useEffect, useState } from 'react';
import { X } from 'lucide-react';

import type { User } from '../types';
import './UserForm.scss';
import { NAME_MAX_LENGTH, NAME_MIN_LENGTH, validateEmail, validateName } from '../../../../utils/validation';

interface UserDrawerProps {
    open: boolean;
    user: User | null;
    nameError: string;
    emailError: string;
    setNameError: (error: string) => void;
    setEmailError: (error: string) => void;
    onClose: () => void;
    onSave: (data: UserFormData) => void;
}

export interface UserFormData {
    name: string;
    email: string;
    password: string;
    role: User['role'];
}

const UserForm = ({
    open,
    user,
    nameError,
    emailError,
    setNameError,
    setEmailError,
    onClose,
    onSave,
}: UserDrawerProps) => {
    const isEditMode = Boolean(user);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<User['role']>(
        'USER' as User['role']
    );

    /*
    * Populate form when editing.
    * Reset form when adding a new user.
    */
    useEffect(() => {
        if (user) {
            setName(user.name ?? '');
            setEmail(user.email ?? '');
            setRole(user.role);
            setPassword('');

            return;
        }

        setName('');
        setEmail('');
        setPassword('');
        setRole('USER' as User['role']);
    }, [user, open]);

    const handleClose = () => {
        onClose();
    };

    const handleOverlayClick = () => {
        onClose();
    };

    const handleDrawerClick = (
        event: React.MouseEvent<HTMLElement>
    ) => {
        event.stopPropagation();
    };

    if (!open) {
        return null;
    }

    return (
        <div className="user-drawer">
            <div
                className="user-drawer__overlay"
                onClick={handleOverlayClick}
            />
            <aside
                className="user-drawer__panel"
                onClick={handleDrawerClick}
                role="dialog"
                aria-modal="true"
                aria-labelledby="user-drawer-title"
            >
                <form
                    className="user-drawer__form"
                    onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                        event.preventDefault();
                        onSave({ name, email, password, role });
                    }}
                    noValidate
                >
                    {/* Header */}
                    <header className="user-drawer__header">
                        <div className="user-drawer__header-content">
                            <h2
                                id="user-drawer-title"
                                className="user-drawer__title"
                            >
                                {isEditMode ? 'Edit User' : 'Add User'}
                            </h2>

                            <p className="user-drawer__subtitle">
                                {isEditMode
                                    ? 'Update user information'
                                    : 'Create a new user'}
                            </p>
                        </div>

                        <button
                            type="button"
                            className="user-drawer__close-button"
                            onClick={handleClose}
                            aria-label="Close drawer"
                        >
                            <X size={20} />
                        </button>
                    </header>
                    <div className="user-drawer__content">
                        <div className="user-drawer__field">
                            <label
                                htmlFor="user-name"
                                className="user-drawer__label"
                            >
                                {"Full Name*"}
                            </label>
                            <input
                                id="user-name"
                                type="text"
                                className={`user-drawer__input ${nameError ? 'user-drawer__input--error' : ''}`}
                                value={name}
                                onChange={(event) => {
                                    const value = event.target.value;
                                    setName(value);
                                    if (value) {
                                        setNameError(validateName(value));
                                    } else {
                                        setNameError("");
                                    }
                                }}
                                onBlur={() => setNameError(validateName(name))}
                                placeholder="Enter name"
                                required
                                minLength={NAME_MIN_LENGTH}
                                maxLength={NAME_MAX_LENGTH}
                            />
                            {nameError && (
                                <span className="user-drawer__error">
                                    {nameError}
                                </span>
                            )}
                        </div>
                        <div className="user-drawer__field">
                            <label
                                htmlFor="user-email"
                                className="user-drawer__label"
                            >
                                {"Email*"}
                            </label>

                            <input
                                id="user-email"
                                type="email"
                                className={`user-drawer__input ${emailError ? 'user-drawer__input--error' : ''}`}
                                value={email}
                                onChange={(event) => {
                                    const value = event.target.value;
                                    setEmail(value);
                                    if (value) {
                                        setEmailError(validateEmail(value));
                                    } else {
                                        setEmailError("");
                                    }
                                }
                                }
                                onBlur={() => setEmailError(validateEmail(email))}
                                placeholder="Enter email"
                                required
                            />
                            {emailError && (
                                <span className="user-drawer__error">
                                    {emailError}
                                </span>
                            )}
                        </div>

                        {/* Password - Add User only */}
                        {!isEditMode && (
                            <div className="user-drawer__field">
                                <label
                                    htmlFor="user-password"
                                    className="user-drawer__label"
                                >
                                    Password
                                </label>

                                <input
                                    id="user-password"
                                    type="password"
                                    className="user-drawer__input"
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    placeholder="Enter password"
                                    required
                                    autoComplete="new-password"
                                />

                                <span className="user-drawer__hint">
                                    The user can change this password later using
                                    the Forgot Password page.
                                </span>
                            </div>
                        )}

                        {/* Role */}
                        <div className="user-drawer__field">
                            <label
                                htmlFor="user-role"
                                className="user-drawer__label"
                            >
                                Role
                            </label>

                            <select
                                id="user-role"
                                className="user-drawer__select"
                                value={role}
                                onChange={(event) =>
                                    setRole(
                                        event.target.value as User['role']
                                    )
                                }
                            >
                                <option value="ADMIN">
                                    Admin
                                </option>

                                <option value="USER">
                                    User
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="user-drawer__footer">
                        <button
                            type="button"
                            className="user-drawer__button user-drawer__button--secondary"
                            onClick={handleClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="user-drawer__button user-drawer__button--primary"
                        >
                            {isEditMode
                                ? 'Save Changes'
                                : 'Create User'}
                        </button>
                    </footer>
                </form>
            </aside>
        </div>
    );
};

export default UserForm;