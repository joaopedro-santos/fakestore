import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let component: ConfirmDialogComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve renderizar o título e a mensagem', () => {
    fixture.componentRef.setInput('title', 'Confirmar');
    fixture.componentRef.setInput('message', 'Deseja prosseguir?');
    fixture.detectChanges();

    const content = fixture.nativeElement.textContent;
    expect(content).toContain('Confirmar');
    expect(content).toContain('Deseja prosseguir?');
  });
});
