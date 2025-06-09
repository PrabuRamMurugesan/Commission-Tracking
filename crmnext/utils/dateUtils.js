exports.getStartDate = (period) => {
    const currentDate = new Date();
  
    switch (period) {
      case 'daily':
        return new Date(currentDate.setHours(0, 0, 0, 0));  // Start of today
      case 'weekly':
        return new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));  // Start of the week
      case 'monthly':
        return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);  // Start of the month
      case 'yearly':
        return new Date(currentDate.getFullYear(), 0, 1);  // Start of the year
      default:
        throw new Error('Invalid period');
    }
  };
  