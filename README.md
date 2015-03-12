0a) Ellenorizd, hogy van-e NPM-ed. Ha nincs, telepitsd
	apt-get install npm
0b) Ha nincs bower-ed, telepitsd fel:
	sudo npm install -g bower

1) Clone-ozd le a GIT Repot.
	git clone git@dev.niif.hu:hexaa/hexaa-gui.git
2) Lepj bele a hexaa-gui mappaba
	Telepits minden fuggoseget:
	sudo npm install
	bower install	
3) Az app mappaban van a forraskod, azt editalhatod akar kozvetlenul is, barmilyen IDE-vel
4) A config.php-t toltsd ki ertelemszeruen, de fontos hogy a GUI es a REST egy hoston legyenek. L
5) a hexaa-gui mappabol add ki a "grunt serve" parancsot. 
	Ekkor elindul egy mini webszerver, ami live mutatja a fobb valtozasokat amiket eloben eszkozolsz a forraskodon
	Ha Cross Site Scripting hiba van (eltero REST es UI portszam), proxyzd be a symphony ala a grunt live serveret.
6) Ha modositottal valamit	
	git add -A
	git commit
	git push origin master (vagy attol fugg epp melyik repoba dolgozunk)

