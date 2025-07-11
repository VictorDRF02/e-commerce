import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ToastComponent } from './toast.component';
import { ToastService } from '../../core/services/toast.service';
import { BehaviorSubject } from 'rxjs';
import { Toast } from '../../core/interfaces/toast';
import { AsyncPipe } from '@angular/common';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let toastService: jasmine.SpyObj<ToastService>;
  let toastsSubject: BehaviorSubject<Toast[]>;

  beforeEach(async () => {
    toastsSubject = new BehaviorSubject<Toast[]>([]);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['remove'], {
      toasts$: toastsSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [ToastComponent, AsyncPipe],
      providers: [
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getToastClass()', () => {
    it('should return correct classes for success type', () => {
      const result = component.getToastClass('success');
      expect(result).toContain('bg-green-500');
      expect(result).toContain('text-white');
    });

    it('should return correct classes for error type', () => {
      const result = component.getToastClass('error');
      expect(result).toContain('bg-red-500');
      expect(result).toContain('text-white');
    });

    it('should return correct classes for info type', () => {
      const result = component.getToastClass('info');
      expect(result).toContain('bg-blue-500');
      expect(result).toContain('text-white');
    });

    it('should return correct classes for warning type', () => {
      const result = component.getToastClass('warning');
      expect(result).toContain('bg-yellow-500');
      expect(result).toContain('text-white');
    });
  });

  describe('remove()', () => {
    it('should call remove method of toastService with correct id', () => {
      const testId = 'test-id-123';
      component.remove(testId);
      expect(toastService.remove).toHaveBeenCalledOnceWith(testId);
    });
  });

  describe('template rendering', () => {
    it('should not render any toast when empty', () => {
      toastsSubject.next([]);
      fixture.detectChanges();
      
      const toastElements = fixture.nativeElement.querySelectorAll('.fixed > div');
      expect(toastElements.length).toBe(0);
    });

    it('should render multiple toasts correctly', () => {
      const testToasts: Toast[] = [
        { id: '1', message: 'Test 1', type: 'success' },
        { id: '2', message: 'Test 2', type: 'error' }
      ];
      
      toastsSubject.next(testToasts);
      fixture.detectChanges();
      
      const toastElements = fixture.nativeElement.querySelectorAll('.fixed > div');
      expect(toastElements.length).toBe(2);
      
      expect(toastElements[0].textContent).toContain('Test 1');
      expect(toastElements[0].classList).toContain('bg-green-500');
      expect(toastElements[1].textContent).toContain('Test 2');
      expect(toastElements[1].classList).toContain('bg-red-500');
    });

    it('should call remove when close button is clicked', () => {
      const testToast: Toast = { id: 'test-id', message: 'Test', type: 'info' };
      toastsSubject.next([testToast]);
      fixture.detectChanges();
      
      const closeButton = fixture.nativeElement.querySelector('button');
      closeButton.click();
      
      expect(toastService.remove).toHaveBeenCalledOnceWith('test-id');
    });
  });

  describe('dynamic updates', () => {
    it('should update when toasts change', fakeAsync(() => {
      toastsSubject.next([]);
      fixture.detectChanges();
      let toastElements = fixture.nativeElement.querySelectorAll('.fixed > div');
      expect(toastElements.length).toBe(0);
      
      toastsSubject.next([{ id: '1', message: 'New', type: 'warning' }]);
      fixture.detectChanges();
      tick();
      
      toastElements = fixture.nativeElement.querySelectorAll('.fixed > div');
      expect(toastElements.length).toBe(1);
      expect(toastElements[0].textContent).toContain('New');
      expect(toastElements[0].classList).toContain('bg-yellow-500');
      
      toastsSubject.next([]);
      fixture.detectChanges();
      tick();
      
      toastElements = fixture.nativeElement.querySelectorAll('.fixed > div');
      expect(toastElements.length).toBe(0);
    }));
  });
});