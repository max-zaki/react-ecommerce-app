import '@testing-library/jest-dom';
import { beforeEach } from 'vitest';

// Clear sessionStorage between tests so cart state never leaks
beforeEach(() => {
  sessionStorage.clear();
});
