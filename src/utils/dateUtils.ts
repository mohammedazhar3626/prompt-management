const formatDate = (dateString: string): string => {
    if (!dateString) {
        return 'Never';
    }
    return Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(dateString));
}

export { formatDate };