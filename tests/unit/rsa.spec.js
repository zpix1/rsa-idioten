import { fermat_factorization, is_probable_prime } from '@/libs/rsa'

describe('fermat factorization', () => {
    test('29**2 works', () => {
        expect(fermat_factorization(29n * 29n)).toBe(BigInt(29));
    });
    // test('4041955903*4171283407 works (string)', () => {
    //     expect(fermat_factorization(4034766187n*4041955903n, 1e8).toString()).toBe('4041955903');
    // });
    // test('1*4171283407 works (string)', () => {
    //     expect(fermat_factorization(1n*4041955903n, 1e6)).toBe(null);
    // });
});

describe('fermat test', () => {
    test('1 is not prime', () => {
        expect(is_probable_prime(1n)).toBeFalsy();
    })
    test('2 is prime', () => {
        expect(is_probable_prime(2n)).toBeTruthy();
    });
    test('6 is not prime', () => {
        expect(is_probable_prime(6n)).toBeFalsy();
    });
    test('123124873 is prime', () => {
        expect(is_probable_prime(123124873n)).toBeTruthy();
    });
    test('123124872 is not prime', () => {
        expect(is_probable_prime(123124872n)).toBeFalsy();
    });
    test('561 is not prime', () => {
        expect(is_probable_prime(561n)).toBeFalsy();
    });
    test('<big number> is prime', () => {
        expect(is_probable_prime(795750265376938701606191432857745189002260451049657418134885151403746333350069202770221413282636132240703013697711749199994233562087912753n)).toBeTruthy();
    });
    test('<big number> is not prime', () => {
        expect(is_probable_prime(7195750265376938701606191432857745189002260451049657418134885151403746333350069202770221413282636132240703013697711749199994233562087912753n)).toBeFalsy();
    });
})
