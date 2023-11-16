
@echo off
echo starting first program.
START /B /WAIT firebase deploy --only functions:beforesignin,functions:registeruser,functions:getuseremail 
echo The first script is executed successfully.
START /B /WAIT firebase deploy --only functions:listusers,functions:getuser,functions:deleteusers 
echo The second script is executed successfully.
START /B /WAIT firebase deploy --only functions:createthumbnail 
echo The third script is executed successfully.
START /B /WAIT firebase deploy --only functions:resetpassword,functions:recoveremail 
echo The fourth script is executed successfully.
