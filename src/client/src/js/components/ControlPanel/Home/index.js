import React, { useState } from 'react'
import styled from 'styled-components'
import { Divider, Button } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import DiscordAvatar from 'js/components/ControlPanel/common/DiscordAvatar'
import { useSelector, useDispatch } from 'react-redux'
import pages from 'js/constants/pages'
import SectionTitle from 'js/components/common/SectionTitle'
import PageHeader from 'js/components/common/PageHeader'
import Wrapper from 'js/components/common/Wrapper'
import MenuButton from 'js/components/ControlPanel/LeftMenu/MenuButton'
import posed from 'react-pose'
import { setActiveGuild } from 'js/actions/guilds'
const Container = styled.div`
  padding: 20px;
  @media only screen and (min-width: 930px) {
    padding: 55px;
  }
  width: 100%;
`

const ServerButtonInner = styled.div`
  display: flex;
  align-items: center;
  h4 {
    margin: 0;
  }
  > div {
    margin-right: 10px;
  }
`

const ServerEditButtonStyles = styled(Wrapper)`
  display: flex;
  overflow: hidden;
  padding: 15px;
  border-style: none;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  margin-bottom: 5px;
  > .ui.button {
    margin-right: 1em;
  }
`

const ServerEditButtons = posed(ServerEditButtonStyles)({
  enter: { height: 66, paddingTop: 15, paddingBottom: 15, transition: { duration: 200 } },
  exit: { height: 0, paddingTop: 0, paddingBottom: 0, transition: { duration: 200 } }
})

const ServerButton = styled(MenuButton)`
  margin-bottom: 0;
  margin-top: 0;
  ${props => props.selected
    ? `border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;`
    : ''};
  span {
    font-size: 1.15em;
  }
`

const NoServers = styled.div`
  text-align: center;
  color: #72767d;
  font-size: 1.15em;
  user-select: none;
  padding: 40px 15px;
  > span {
    margin-top: 8px;
    font-size: 1.1em;
  }
`

function Home (props) {
  const [selectedGuildID, setSelectedGuildID] = useState('')
  const guilds = useSelector(state => state.guilds)
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const { redirect } = props

  function setGuild (guildID) {
    dispatch(setActiveGuild(guildID))
  }

  async function onClickFeeds (guildID) {
    await setGuild(guildID)
    redirect(pages.FEEDS)
  }

  async function onClickSettings (guildID) {
    await setGuild(guildID)
    redirect(pages.SERVER_SETTINGS)
  }

  const serverButtons = []
  for (const guild of guilds) {
    const thisGuildId = guild.id
    const iconURL = guild.iconURL ? `${guild.iconURL}?size=256` : ''
    serverButtons.push(
      <div key={thisGuildId}>
        <ServerButton nonmenu padding='15px' selected={selectedGuildID === thisGuildId} onClick={e => setSelectedGuildID(thisGuildId)}>
          <ServerButtonInner>
            <DiscordAvatar src={iconURL} width='48px' onClick={e => setSelectedGuildID(thisGuildId)} />
            <span>
              {guild.name}
              {/* <p>{feeds && feeds[thisGuildId] ? Object.keys(feeds[thisGuildId]).length : undefined} feeds</p> */}
            </span>
          </ServerButtonInner>
        </ServerButton>
        <ServerEditButtons pose={selectedGuildID === thisGuildId ? 'enter' : 'exit'}>
          <Button content='Feeds' onClick={e => onClickFeeds(thisGuildId)} />
          <Button content='Settings' onClick={e => onClickSettings(thisGuildId)} />
        </ServerEditButtons>
      </div>
    )
  }

  return (
    <Container>
      <PageHeader heading={`Hi there, ${user ? user.username : '(no name found)'}!`} subheading='Make your life immensely easier by using this web interface! (though excuse my appearance while I am still under construction)' />
      {/* <AlertBox warn>
        This UI is still under development. It is not meant to completely replace regular Discord commands. Occasional issues are expected - please report them if you encounter any!
      </AlertBox> */}
      {/* <Divider />
      <h2>What is Discord.RSS?</h2>
      <ParagraphText>
        Discord.RSS is an RSS bot.
      </ParagraphText>
      <Divider />
      <SectionTitle>
        <h3>Servers</h3>
        <p>Select a server to see its feeds. All your changes will be reflected for this feed in this server. You may also change your active server in the left menu. Only servers where you have Manage Channel permissions, and the bot is a member will be shown.</p>
      </SectionTitle>
      <SelectedGuildContainer>
        <h4>SELECTED</h4>
        <p>{guilds[guildId] ? `${guilds[guildId].name} (${guildId})` : Object.keys(guilds).length === 0 ? 'No servers found' : 'None selected'}</p>
      </SelectedGuildContainer>
      <ServerIconsWrapper>
        {serverIcons}
      </ServerIconsWrapper> */}

      <Divider />
      <SectionTitle heading='Servers' subheading='Select a server to start seeing its feeds. Only servers where you have Manage Channel permissions, and the bot is a member will be shown. You can also change your active server in the left menu.' />
      {serverButtons.length > 0
        ? serverButtons
        : (
          <NoServers>
            <h4>NO ELIGIBLE SERVERS</h4>
            <span>Make sure MonitoRSS is in the right servers where you have MANAGE CHANNEL permissions</span>
          </NoServers>)}

      <Divider />
      {/* <SectionTitle heading='Rating'/>
      <Rating size='massive' maxRating={5} />
      <Divider /> */}
    </Container>
  )
}

Home.propTypes = {
  redirect: PropTypes.func
}

export default Home
