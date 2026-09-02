import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import UsersTable from './components/UsersTable';
import UserForm, { UserFormData } from './components/UserForm';
import type { User, UsersResponse } from './types';
import { GET_USERS } from '../../../graphql/users/queries';
import { useDebounce } from '../../../hooks';
import { REGISTER_USER, UPDATE_USER } from '../../../graphql/users/mutations';
import { toast } from 'react-toastify';
import './Users.scss';
import { validateEmail, validateName } from '../../../utils/validation';
import { Plus, Search } from 'lucide-react';


const Users = () => {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 400);
    const [selectedUser, setSelectedUser] = useState<User | null>(null,);
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [updateUser, { loading: updateLoading }] = useMutation(UPDATE_USER);
    const [registerUser, { loading: registerLoading }] = useMutation(REGISTER_USER);
    const [
        drawerOpen,
        setDrawerOpen,
    ] = useState(false);
    const {
        data,
        loading,
        error,
        refetch: refetchUsers,
    } = useQuery<UsersResponse>(GET_USERS,
        {
            variables: {
                page,
                limit,
                search: debouncedSearch
            }, fetchPolicy: 'network-only',
        },
    );
    const users = data?.users?.users ?? [];
    const total = data?.users?.total ?? 0;
    const totalPages =
        Math.max(
            1,
            Math.ceil(
                total / limit,
            ),
        );

    const handleEdit = (user: User,) => {
        setSelectedUser(user);
        setDrawerOpen(
            true,
        );
    };

    const handleAddUser = () => {
        setSelectedUser(null,);
        setDrawerOpen(true);
    }

    const handleCloseDrawer =
        () => {
            setDrawerOpen(
                false,
            );
            setTimeout(
                () => {
                    setSelectedUser(
                        null,
                    );
                },
                300,
            );
        };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(
            event.target.value,
        );
        setPage(1);
    };

    const handlePreviousPage =
        () => {
            setPage(
                (previousPage) =>
                    Math.max(
                        1,
                        previousPage - 1,
                    ),
            );
        };

    const handleNextPage = () => {
        setPage(
            (previousPage) =>
                Math.min(
                    totalPages,
                    previousPage + 1,
                ),
        );
    };

    const handleSaveUser = async (formData: UserFormData) => {
        const ValidatedName = validateName(formData.name);
        const ValidatedEmail = validateEmail(formData.email);

        if (ValidatedName || ValidatedEmail) {
            return;
        }
        try {
            if (selectedUser) {
                const hasChanges =
                    formData.name.trim() !== selectedUser.name.trim() ||
                    formData.email.trim() !== selectedUser.email.trim() ||
                    formData.role !== selectedUser.role;
                if (!hasChanges) {
                    toast.info('No changes detected. User not updated.');
                    return;
                }
                const response = await updateUser({
                    variables: {
                        userId: selectedUser.id,
                        input: {
                            name: formData.name,
                            email: formData.email,
                            role: formData.role,
                        },
                    },
                });
                if (!response.data) {
                    throw new Error('Failed to update user');
                }
                toast.success('User updated successfully');
                console.log('User updated:', response);
            } else {
                const response = await registerUser({
                    variables: {
                        name: formData.name,
                        email: formData.email,
                        password: formData.password,
                        role: formData.role,
                    },
                });
                if (!response.data) {
                    throw new Error('Failed to create user');
                }
                toast.success('User created successfully');
                console.log('User registered:', response);
            }
            await refetchUsers();
            setDrawerOpen(false);
        } catch (error: unknown) {
            console.error('Error:', error);
            let errorMessage = 'Something went wrong. Please try again.';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            toast.error(`Error: ${errorMessage}`);
        }
    };

    return (
        <div className="users-page">
            <div className="users-page__header">
                <h1>Users</h1>
                <input
                    type="text"
                    className="users-search"
                    placeholder="Search users..."
                    value={search}
                    onChange={handleSearchChange}
                />
                <Search size={18} />
                <button type="button" onClick={handleAddUser} className="add-user-button">
                    <Plus size={18}
                    />
                    {"Add New User"}
                </button>
            </div>
            <UsersTable
                users={users}
                loading={loading}
                error={error}
                onEdit={handleEdit}
                onToggle={() => { }}
                onDelete={() => { }}
            />
            {!loading && (
                <div className="users-pagination">
                    <div className="users-pagination__info"
                    >
                        Total Users:
                        {' '}
                        {total}
                        {' | '}
                        Page
                        {' '}
                        {page}
                        {' '}
                        of
                        {' '}
                        {totalPages}
                    </div>
                    <div className="users-pagination__controls">
                        <button
                            type="button"
                            disabled={
                                page === 1
                            }
                            onClick={
                                handlePreviousPage
                            }
                        >
                            Previous
                        </button>
                        <button
                            type="button"

                            disabled={
                                page === totalPages
                            }
                            onClick={
                                handleNextPage
                            }
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
            <UserForm
                open={drawerOpen}
                user={selectedUser}
                nameError={nameError}
                emailError={emailError}
                setNameError={setNameError}
                setEmailError={setEmailError}
                onClose={
                    handleCloseDrawer
                }
                onSave={handleSaveUser}
            />
        </div>
    );
};
export default Users;
