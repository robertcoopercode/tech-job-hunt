import uuidv4 from 'uuid/v4';
import { ContactType } from '../types';

export const createNewContact = (order: number): ContactType => ({
    id: uuidv4().substr(0, 12),
    name: '',
    position: '',
    email: '',
    phone: '',
    notes: '',
    order,
});
