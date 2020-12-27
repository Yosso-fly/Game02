
#define RULE_ARG(C,X,Y) mapgen_panel_container* C, int X, int Y
#define RULE_ARG_P RULE_ARG(cont, x, y);
#define RULES_NUM 8


void rule_0(RULE_ARG_P);
void rule_1(RULE_ARG_P);
void rule_2(RULE_ARG_P);
void rule_3(RULE_ARG_P);
void rule_4(RULE_ARG_P);
void rule_5(RULE_ARG_P);
void rule_6(RULE_ARG_P);
void rule_7(RULE_ARG_P);
void rule_otherwise (RULE_ARG_P); // 上記以外


mapgen_rule rules[RULES_NUM] = {
    {192,179, 93, rule_0},
    {174,172,159, rule_1},
    {122,139,121, rule_2},
    {193,131,188, rule_3},
    {255,255,255, rule_4},

    {192,137, 93, rule_5},
    {209,209,209, rule_6},
    {150,182,147, rule_7}
};


void rule_0(RULE_ARG(cont, x, y)){

    panel_container_insert_9(cont, x, y, 0x01, 0,
        0x00, 0x01, 0x02,
        0x10, 0x11, 0x12,
        0x20, 0x21, 0x22,
        0x03, 0x04,
        0x13, 0x14
        );
    
}

void rule_1(RULE_ARG(cont, x, y)){

    panel_container_insert_9(cont, x, y, 0x01, 0,
        0x15, 0x16, 0x17,
        0x25, 0x26, 0x27,
        0x35, 0x36, 0x37,
        0x23, 0x24,
        0x33, 0x34
        );
    
}
void rule_2(RULE_ARG(cont, x, y)){

    panel_container_insert_9(cont, x, y, 0x01, 0,
        0x40, 0x41, 0x42,
        0x50, 0x51, 0x52,
        0x60, 0x61, 0x62,
        0x43, 0x44,
        0x53, 0x54
        );
    
}
void rule_3(RULE_ARG(cont, x, y)){

    panel_container_insert_9(cont, x, y, 0x01, 0,
        0x55, 0x56, 0x57,
        0x65, 0x66, 0x67,
        0x75, 0x76, 0x77,
        0x63, 0x64,
        0x73, 0x74
        );
    
}
void rule_4(RULE_ARG(cont, x, y)){

    panel_container_insert_9(cont, x, y, 0x01, 0,
        0x80, 0x81, 0x82,
        0x90, 0x91, 0x92,
        0x95, 0x96, 0x97,
        0x83, 0x84,
        0x93, 0x94
        );
    
}

void rule_5(RULE_ARG(cont, x, y)){
    panel_container_insert_9(cont, x, y, 0x00, 0,
        0x05, 0x06, 0x07,
        PANEL_VOID,PANEL_VOID,PANEL_VOID,
        PANEL_VOID,PANEL_VOID,PANEL_VOID,
        PANEL_VOID,PANEL_VOID,PANEL_VOID,PANEL_VOID
        );
}

void rule_6(RULE_ARG(cont, x, y)){
    panel_container_insert_9(cont, x, y, 0x00, 0,
        0x30, 0x31, 0x32,
        PANEL_VOID,PANEL_VOID,PANEL_VOID,
        PANEL_VOID,PANEL_VOID,PANEL_VOID,
        PANEL_VOID,PANEL_VOID,PANEL_VOID,PANEL_VOID
        );
}
void rule_7(RULE_ARG(cont, x, y)){
    panel_container_insert_9(cont, x, y, 0x00, 0,
        0x45, 0x46, 0x47,
        PANEL_VOID,PANEL_VOID,PANEL_VOID,
        PANEL_VOID,PANEL_VOID,PANEL_VOID,
        PANEL_VOID,PANEL_VOID,PANEL_VOID,PANEL_VOID
        );
}
void rule_otherwise(RULE_ARG(cont, x, y)){
    panel_container_insert(cont, x, y, PANEL_VOID, 0x00, 0);
}

