import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ToastService } from './toast.service';
import { Toast } from '../interfaces/toast';
import { take } from 'rxjs/operators';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  afterEach(() => {
    (service as any).toasts.next([]);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('show()', () => {
    it('should add a new toast to the toasts list', () => {
      const initialCount = (service as any).toasts.value.length;
      
      service.show('Test message', 'info');
      
      service.toasts$.pipe(take(1)).subscribe(toasts => {
        expect(toasts.length).toBe(initialCount + 1);
        expect(toasts[toasts.length - 1].message).toBe('Test message');
        expect(toasts[toasts.length - 1].type).toBe('info');
      });
    });

    it('should generate a unique id for each toast', () => {
      service.show('First message');
      service.show('Second message');
      
      service.toasts$.pipe(take(1)).subscribe(toasts => {
        expect(toasts[0].id).toBeDefined();
        expect(toasts[1].id).toBeDefined();
        expect(toasts[0].id).not.toBe(toasts[1].id);
      });
    });
  });

  describe('remove()', () => {
    it('should remove a toast by id', () => {
      service.show('To be removed', 'info');
      service.show('To keep', 'success');
      
      let toastId: string;
      service.toasts$.pipe(take(1)).subscribe(toasts => {
        toastId = toasts[0].id;
        service.remove(toastId);
      });
      
      service.toasts$.pipe(take(1)).subscribe(toasts => {
        expect(toasts.length).toBe(1);
        expect(toasts[0].message).toBe('To keep');
        expect(toasts.some(t => t.id === toastId)).toBeFalse();
      });
    });

    it('should do nothing if toast id does not exist', () => {
      service.show('Test message');
      
      let initialToasts: Toast[] = [];
      service.toasts$.pipe(take(1)).subscribe(toasts => {
        initialToasts = [...toasts];
        service.remove('non-existent-id');
      });
      
      service.toasts$.pipe(take(1)).subscribe(toasts => {
        expect(toasts).toEqual(initialToasts);
      });
    });
  });

  describe('auto removal', () => {
    it('should automatically remove toast after 5 seconds', fakeAsync(() => {
      service.show('Temporary message');
      
      let initialCount: number;
      service.toasts$.pipe(take(1)).subscribe(toasts => {
        initialCount = toasts.length;
      });
      
      tick(4999);
      service.toasts$.pipe(take(1)).subscribe(toasts => {
        expect(toasts.length).toBe(initialCount);
      });
      
      tick(2);
      service.toasts$.pipe(take(1)).subscribe(toasts => {
        expect(toasts.length).toBe(initialCount - 1);
      });
    }));
  });

  describe('convenience methods', () => {
    it('success() should show a success toast', () => {
      service.success('Success message');
      
      service.toasts$.pipe(take(1)).subscribe(toasts => {
        expect(toasts[toasts.length - 1].type).toBe('success');
        expect(toasts[toasts.length - 1].message).toBe('Success message');
      });
    });

    it('error() should show an error toast', () => {
      service.error('Error message');
      
      service.toasts$.pipe(take(1)).subscribe(toasts => {
        expect(toasts[toasts.length - 1].type).toBe('error');
        expect(toasts[toasts.length - 1].message).toBe('Error message');
      });
    });

    it('info() should show an info toast', () => {
      service.info('Info message');
      
      service.toasts$.pipe(take(1)).subscribe(toasts => {
        expect(toasts[toasts.length - 1].type).toBe('info');
        expect(toasts[toasts.length - 1].message).toBe('Info message');
      });
    });

    it('warning() should show a warning toast', () => {
      service.warning('Warning message');
      
      service.toasts$.pipe(take(1)).subscribe(toasts => {
        expect(toasts[toasts.length - 1].type).toBe('warning');
        expect(toasts[toasts.length - 1].message).toBe('Warning message');
      });
    });
  });

  describe('multiple toasts', () => {
    it('should handle multiple toasts correctly', () => {
      service.info('First message');
      service.success('Second message');
      service.error('Third message');
      
      service.toasts$.pipe(take(1)).subscribe(toasts => {
        expect(toasts.length).toBe(3);
        expect(toasts[0].message).toBe('First message');
        expect(toasts[1].message).toBe('Second message');
        expect(toasts[2].message).toBe('Third message');
      });
    });
  });
});