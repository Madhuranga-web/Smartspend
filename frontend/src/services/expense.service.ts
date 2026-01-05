const API_URL = 'http://localhost:3001/expenses';

export const expenseService = {
  // 1. සියලුම වියදම් ලබා ගැනීම
  async getAllExpenses() {
    const token = localStorage.getItem('token');
    const res = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      cache: 'no-store' // අලුත්ම දත්ත ගේන්න caching අයින් කරනවා
    });

    if (!res.ok) {
      throw new Error('Failed to fetch expenses');
    }
    return res.json();
  },

  // 2. අලුත් වියදමක් ඇතුළත් කිරීම (AI Category එක Backend එකෙන් හැදෙනවා)
  async addExpense(expenseData: any) {
    const token = localStorage.getItem('token');
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(expenseData),
    });

    if (!res.ok) {
      throw new Error('Failed to add expense');
    }
    return res.json();
  },

  // 3. වියදමක් මකා දැමීම (Dashboard Table එකට අවශ්‍යයි)
  async deleteExpense(id: string) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    if (!res.ok) {
      throw new Error('Failed to delete expense');
    }
    return res.json();
  },

  // 4. AI එකෙන් මූල්‍ය උපදෙස් ලබා ගැනීම
  async getFinancialAdvice() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/advice`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch AI advice');
    }
    // Gemini එකෙන් එන්නේ string එකක් නිසා .text() පාවිච්චි කරනවා
    return res.text();
  }
};