
typedef struct {
    int size;
    struct { int image, depth; bool collision; } panel[PANEL_SEGMENTS_IN_DATA];
} mapgen_panel_container;

typedef struct {
    int r, g, b;
    void (*func)(mapgen_panel_container*, int, int);
} mapgen_rule;

char hexchar(int n){
    return n + (n<10 ? '0':'a'-10);
}

void format_panel(char *target, mapgen_panel_container *cont, int adress){
    
    int point=0, value;
    
    // 画像番号
    for(int i=0; i<PANEL_SEGMENTS_IN_DATA; i++){
        value = cont[adress].panel[i].image;
        for(int j=0; j<3; j++){
            int n = value%16;
            target[point++] = hexchar(n);
            value /= 16;
        }

        target[point++] = hexchar(cont[adress].panel[i].collision);

        value = cont[adress].panel[i].depth;
        for(int j=0; j<2; j++){
            int n = value%16;
            target[point++] = hexchar(n);
            value /= 16;
        }
        
        if(i != PANEL_SEGMENTS_IN_DATA-1) target[point++] = ',';
    }

    while(++point < PANEL_DATA_SIZE){
        target[point] = '0';
    }
    
}

void panel_container_insert(mapgen_panel_container *cont, int x, int y, int image, int depth, bool collision){

    
    
    int ad = y*image_width+x;
    
    if (ad >= image_width * image_height || ad < 0) return;

    if(cont[ad].panel[0].depth > depth) return;

    cont[ad].panel[0].image = image;
    cont[ad].panel[0].depth = depth;
    cont[ad].panel[0].collision = collision;
    cont[ad].size++;
}

bool panel_equal(mapgen_panel_container *cont, int ax, int ay, int bx, int by){
    
    if(bx < 0 || bx >= image_width || by < 0 || by >= image_height) return 0;
    
    bool result = 1;
    for(int i=0; i<3; i++)
        result = result && (image_data[ay][ax*3+i] == image_data[by][bx*3+i]);
    return result;
}

int panel_equal_9(mapgen_panel_container *cont, int x, int y){
    int result = 0;
    for(int iy=-1; iy<=1; iy++){
        for(int ix=-1; ix<=1; ix++){
            result += ((int)panel_equal(cont, x, y, x+ix, y+iy)) << ((iy+1)*3+(ix+1));
        }
    }
    return result;
}

int panel_container_insert_9(
    mapgen_panel_container *cont, int x, int y, int depth, bool collision,
    int ts, int tc,   int te,
    int cs, int base, int ce,
    int bs, int bc,   int be,
    int pbe, int pbs,
    int pte, int pts){

    

    int equals = panel_equal_9(cont, x, y);

    //                0,0|0,1|1,0
    int ts_panel[] = {ts , cs, tc}; int ts_exists = (equals>>0)%2;
    int tc_panel[] = {tc ,pte,pts}; int tc_exists = (equals>>1)%2;
    int te_panel[] = {te , ce, tc}; int te_exists = (equals>>2)%2;
    int cs_panel[] = {cs ,pbs,pts}; int cs_exists = (equals>>3)%2;
    int ce_panel[] = {ce ,pbe,pte}; int ce_exists = (equals>>5)%2;
    int bs_panel[] = {bs , bc, cs}; int bs_exists = (equals>>6)%2;
    int bc_panel[] = {bc ,pbe,pbs}; int bc_exists = (equals>>7)%2;
    int be_panel[] = {be , bc, ce}; int be_exists = (equals>>8)%2;

    if(!ts_exists && !(tc_exists || cs_exists) )
        panel_container_insert(cont, x-1, y-1, ts_panel[cs_exists*2+tc_exists], depth, collision);
    if(!tc_exists)
        panel_container_insert(cont, x  , y-1, tc_panel[te_exists*2+ts_exists], depth, collision);
    if(!te_exists && !(tc_exists || ce_exists) )
        panel_container_insert(cont, x+1, y-1, te_panel[ce_exists*2+tc_exists], depth, collision);
    if(!cs_exists)
        panel_container_insert(cont, x-1, y  , cs_panel[bs_exists*2+ts_exists], depth, collision);
    if(!ce_exists)
        panel_container_insert(cont, x+1, y  , ce_panel[be_exists*2+te_exists], depth, collision);
    if(!bs_exists && !(cs_exists || bc_exists) )
        panel_container_insert(cont, x-1, y+1, bs_panel[bc_exists*2+cs_exists], depth, collision);
    if(!bc_exists)
        panel_container_insert(cont, x  , y+1, bc_panel[bs_exists*2+be_exists], depth, collision);
    if(!be_exists && !(ce_exists || bc_exists) )
        panel_container_insert(cont, x+1, y+1, be_panel[bc_exists*2+ce_exists], depth, collision);

    panel_container_insert(cont, x, y, base, depth, collision);

}


// quoted from : https://it-ojisan.tokyo/c-str-reverse/
void reverse(char* str){
	int size = strlen(str);
	int i,j;
	char tmp = {0};
	
	for(i = 0, j = size - 1; i < size / 2; i++, j--){
		tmp = str[i];
		str[i] = str[j];
		str[j] = tmp;
	}
	return;	
}