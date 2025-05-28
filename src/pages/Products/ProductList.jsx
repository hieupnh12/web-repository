import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Package,
  Smartphone
} from 'lucide-react';

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBrand, setFilterBrand] = useState('all');

  // Mock data
  const products = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      brand: