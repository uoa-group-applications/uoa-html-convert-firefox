rm convert.xpi
cd convert
zip -r ../convert.zip *
cd ..
mv convert.zip convert.xpi
#shasum -a256 convert.xpi

