// Copyright (C) 2018 Aleksey Melnikov
// mailto: z9115011@gmail.com
// This project is licensed under the terms of the MIT license.
// https://github.com/m-alx/yopsilon-mask

export class MaskState {

    static EMPTY = new MaskState('EMPTY');
    static TYPING = new MaskState('...');
    static OK = new MaskState('OK');

    constructor(public name: string) { }
}
